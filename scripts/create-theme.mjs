import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { options } from './args.mjs'
import { MINIMAL_WEBP } from './media.mjs'

const root = path.resolve(import.meta.dirname, '..')
const parsed = options()
const slug = parsed.positionals[0]
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  throw new Error('Usage: node scripts/create-theme.mjs <slug> [--out dir] [--official] [--style StyleId]')
}
const official = parsed.flags.has('official')
const out = path.resolve(parsed.values.out ?? path.join(process.cwd(), `theme-${slug}`))
const style = parsed.values.style ?? 'customTheme'
if (!/^[A-Za-z][A-Za-z0-9]*$/.test(style)) throw new Error('Theme style id must match ^[A-Za-z][A-Za-z0-9]*$')
const packageName = official ? `@piharness/theme-${slug}` : `@example/theme-${slug}`
await assertEmpty(out)
const license = await readFile(path.join(root, 'LICENSE'))
await mkdir(path.join(out, 'assets'), { recursive: true })
await writeFile(path.join(out, 'preview.webp'), MINIMAL_WEBP)
await writeFile(path.join(out, 'assets', 'wallpaper.webp'), MINIMAL_WEBP)
await writeFile(path.join(out, 'assets', 'portrait.webp'), MINIMAL_WEBP)
await writeFile(path.join(out, 'LICENSE'), license)
const manifest = {
  formatVersion: 1,
  id: slug,
  name: parsed.values.name ?? slug,
  version: '1.0.0',
  author: 'wangmiao',
  description: `Pi-Harness theme pack ${slug}`,
  license: 'MIT',
  compatiblePiHarness: '>=2.4.0',
  preview: 'preview.webp',
  variants: [
    {
      id: style,
      skinId: slug,
      name: parsed.values.name ?? slug,
      appearance: 'dark',
      portrait: true,
      accent: '#91a9c7',
      frameWidth: 1,
      frameHeight: 1,
      portraitAsset: 'assets/portrait.webp',
      cssImages: { '--market-scene-wallpaper': 'assets/wallpaper.webp' }
    }
  ]
}
await writeFile(path.join(out, 'theme-pack.json'), `${JSON.stringify(manifest, null, 2)}\n`)
await writeFile(
  path.join(out, 'package.json'),
  `${JSON.stringify(
    {
      name: packageName,
      version: '1.0.0',
      private: false,
      description: manifest.description,
      license: 'MIT',
      files: ['theme-pack.json', 'preview.webp', 'assets', 'LICENSE', 'README.md'],
      piHarness: { kind: 'theme', compatible: '>=2.4.0' },
      publishConfig: { access: 'public' }
    },
    null,
    2
  )}\n`
)
await writeFile(
  path.join(out, 'README.md'),
  `# ${packageName}

Independent theme pack. It does not depend on the Skin Starter directory.

\`customTheme\` is a protocol-valid style id. Pi-Harness currently applies a market theme only when the variant id is an existing mascot style. Color tokens still belong to Skin Protocol v1 and are imported with \`pi-harness-skin.json\`.

A package name under \`@piharness\` does not grant publish permission. Market accepts only:

\`^@piharness/(theme|pet)-[a-z0-9][a-z0-9-]*$\`

This package is ${official ? 'named for the official scope' : 'an example package and is not an official market package'}.
`
)
console.log(out)

async function assertEmpty(directory) {
  try {
    await access(directory)
    throw new Error(`Refusing to overwrite ${directory}`)
  } catch (error) {
    if (error && error.code !== 'ENOENT') throw error
  }
}
