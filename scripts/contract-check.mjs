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
const missing = required.filter(([source, needle]) => !source.includes(needle)).map(([, needle]) => needle)
if (missing.length) throw new Error(`Protocol contract drifted: ${missing.join(', ')}`)
console.log('protocol contract matches Pi-Harness')
