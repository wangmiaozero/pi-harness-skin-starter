import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { options } from './args.mjs'
import { MINIMAL_WEBP } from './media.mjs'

const root = path.resolve(import.meta.dirname, '..')
const parsed = options()
const slug = parsed.positionals[0]
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  throw new Error('Usage: node scripts/create-pet.mjs <slug> [--out dir] [--official]')
}
const official = parsed.flags.has('official')
const out = path.resolve(parsed.values.out ?? path.join(process.cwd(), `pet-${slug}`))
const packageName = official ? `@piharness/pet-${slug}` : `@example/pet-${slug}`
await assertEmpty(out)
const license = await readFile(path.join(root, 'LICENSE'))
const clips = ['idle', 'thinking', 'running', 'success']
for (const clip of clips) {
  await mkdir(path.join(out, 'clips', clip), { recursive: true })
  await writeFile(path.join(out, 'clips', clip, `${clip}_001.webp`), MINIMAL_WEBP)
}
await writeFile(path.join(out, 'preview.webp'), MINIMAL_WEBP)
await writeFile(path.join(out, 'LICENSE'), license)
const clipEntry = (name) => ({ dir: `clips/${name}`, frames: 1, loop: name === 'idle', frameDurationsMs: [80] })
const manifest = {
  formatVersion: 1,
  id: slug,
  name: parsed.values.name ?? slug,
  nameEn: parsed.values.name ?? slug,
  author: 'wangmiao',
  version: '1.0.0',
  license: 'MIT',
  baseWidth: 64,
  baseHeight: 64,
  fps: 8,
  preview: 'preview.webp',
  defaultAnimation: 'idle',
  agentStateMapping: { idle: 'idle', thinking: 'thinking', running: 'running', success: 'success' },
  clips: Object.fromEntries(clips.map((clip) => [clip, clipEntry(clip)]))
}
await writeFile(path.join(out, 'pet-pack.json'), `${JSON.stringify(manifest, null, 2)}\n`)
await writeFile(
  path.join(out, 'package.json'),
  `${JSON.stringify(
    {
      name: packageName,
      version: '1.0.0',
      private: false,
      description: `Pi-Harness pet pack ${slug}`,
      license: 'MIT',
      files: ['pet-pack.json', 'preview.webp', 'clips', 'LICENSE', 'README.md'],
      piHarness: { kind: 'pet', compatible: '>=2.4.0' }
    },
    null,
    2
  )}\n`
)
await writeFile(
  path.join(out, 'README.md'),
  `# ${packageName}

Independent pet pack using pet-pack.json. Frames are \`<clip>_001.webp\`.

This package is ${official ? 'named for the official scope' : 'an example package and is not an official market package'}.
An \`@piharness\` name does not list the pack. Official packs are added by a reviewed pull request to \`wangmiaozero/pi-Harness-packages\`.
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
