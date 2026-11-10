import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { MINIMAL_WEBP } from './media.mjs'
import { validateSkinManifest } from './protocol/skin.mjs'

const starter = path.resolve(import.meta.dirname, '..')
const source = path.resolve(process.argv[2] ?? '.')
const manifest = validateSkinManifest(JSON.parse(await readFile(path.join(source, 'pi-harness-skin.json'), 'utf8')))
const destination = path.resolve(process.argv[3] ?? path.join(source, '..', `theme-${manifest.id}`))
await mkdir(path.join(destination, 'assets'), { recursive: true })
const accent = typeof manifest.tokens.accent === 'string' && /^#[0-9a-fA-F]{6}$/.test(manifest.tokens.accent)
  ? manifest.tokens.accent
  : null
if (!accent) throw new Error('Skin accent must be #rrggbb before it can be copied into a theme variant. The skin itself was not changed.')
const copied = {}
for (const [key, file] of Object.entries(manifest.assets ?? {})) {
  const target = `assets/${path.basename(file)}`
  await cp(path.join(source, file), path.join(destination, target))
  copied[key] = target
}
let placeholder = false
if (!copied.preview) {
  await writeFile(path.join(destination, 'preview.webp'), MINIMAL_WEBP)
  copied.preview = 'preview.webp'
  placeholder = true
}
const theme = {
  formatVersion: 1,
  id: manifest.id,
  name: manifest.name,
  version: '1.0.0',
  author: manifest.author || 'wangmiao',
  description: manifest.description || manifest.name,
  license: 'MIT',
  compatiblePiHarness: '>=2.4.0',
  preview: copied.preview,
  variants: [
    {
      id: 'customTheme',
      skinId: manifest.id,
      name: manifest.name,
      appearance: manifest.appearance,
      portrait: Boolean(copied.portrait),
      accent,
      frameWidth: 1,
      frameHeight: 1,
      ...(copied.portrait ? { portraitAsset: copied.portrait } : {}),
      ...(copied.wallpaper ? { cssImages: { '--market-scene-wallpaper': copied.wallpaper } } : {})
    }
  ]
}
await writeFile(path.join(destination, 'theme-pack.json'), `${JSON.stringify(theme, null, 2)}\n`)
await cp(path.join(starter, 'LICENSE'), path.join(destination, 'LICENSE'))
await writeFile(
  path.join(destination, 'package.json'),
  `${JSON.stringify(
    {
      name: `@example/theme-${manifest.id}`,
      version: '1.0.0',
      license: 'MIT',
      files: ['theme-pack.json', 'README.md', 'MIGRATION.md', 'LICENSE', 'assets'].concat(
        copied.preview === 'preview.webp' ? ['preview.webp'] : []
      ),
      piHarness: { kind: 'theme', compatible: '>=2.4.0' }
    },
    null,
    2
  )}\n`
)
await writeFile(
  path.join(destination, 'MIGRATION.md'),
  `# Migration from Skin Protocol v1

Source id \`${manifest.id}\` was read. \`pi-harness-skin.json\` was not modified. Pi-Harness still imports that file from Settings → Theme → Import Skin.

Theme Pack Protocol v1 cannot store the full token set. These tokens remain in the skin manifest:

${Object.keys(manifest.tokens).map((key) => `- ${key}`).join('\n')}

Copied accent: \`${accent}\`.
${placeholder ? 'The skin had no preview asset, so the theme pack contains a 1×1 placeholder preview. Replace it before publishing.' : 'Bitmap assets were copied.'}

This generated package uses \`@example\` and is not an official market package.
`
)
await writeFile(path.join(destination, 'README.md'), `# Migrated theme ${manifest.id}\n\nSee MIGRATION.md. The original skin import still works.\n`)
console.log(destination)
