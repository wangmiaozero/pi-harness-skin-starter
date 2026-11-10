import { readFile } from 'node:fs/promises'
import path from 'node:path'

const starter = path.resolve(import.meta.dirname, '..')
const core = path.resolve(starter, '../pi-Harness')
const theme = await readFile(path.join(core, 'src/shared/market/theme-manifest.ts'), 'utf8')
const pet = await readFile(path.join(core, 'src/main/pet/pack.ts'), 'utf8')
const names = await readFile(path.join(core, 'src/shared/market/package-name.ts'), 'utf8')
const required = [
  [theme, 'formatVersion'] ,
  [theme, 'compatiblePiHarness'],
  [theme, '/^[a-z0-9][a-z0-9-]*$/'],
  [theme, '/^#[0-9a-fA-F]{6}$/'],
  [pet, 'const MAX_CLIPS = 256'],
  [pet, 'const MAX_FRAMES_PER_CLIP = 1024'],
  [names, String.raw`^@piharness\/(theme|pet)-[a-z0-9][a-z0-9-]*$`]
]
const packages = path.resolve(starter, '../pi-Harness-packages')
const files = [
  [path.join(starter, 'protocol/market-catalog.schema.json'), path.join(core, 'src/shared/market/market-catalog.schema.json')],
  [path.join(starter, 'protocol/market-catalog.schema.json'), path.join(packages, 'schema/market-catalog.schema.json')],
  [path.join(starter, 'scripts/zip.mjs'), path.join(packages, 'scripts/zip.mjs')]
]
for (const [left, right] of files) {
  if ((await readFile(left)) .toString() !== (await readFile(right)).toString()) {
    throw new Error(`Protocol contract drifted: ${path.basename(left)}`)
  }
}
const limits = await readFile(path.join(core, 'src/main/market/limits.ts'), 'utf8')
const lib = await readFile(path.join(packages, 'scripts/market-lib.mjs'), 'utf8')
for (const needle of ['650 * 1024 * 1024', '750 * 1024 * 1024']) {
  if (!limits.includes(needle) || !lib.includes(needle)) throw new Error(`Protocol contract drifted: ${needle}`)
}
const missing = required.filter(([source, needle]) => !source.includes(needle)).map(([, needle]) => needle)
if (missing.length) throw new Error(`Protocol contract drifted: ${missing.join(', ')}`)
console.log('protocol contract matches Pi-Harness')
