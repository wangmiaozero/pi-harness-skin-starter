import { lstat, readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { isJpeg, isPng, isWebp } from './media.mjs'
import { marketEligible, readHarness, rejectUnsafeTree, validatePackageJson } from './protocol/package.mjs'
import { frameFileName, validatePetPackManifest } from './protocol/pet.mjs'
import { validateSkinManifest } from './protocol/skin.mjs'
import { declaredThemeAssets, validateThemePackManifest } from './protocol/theme.mjs'

const root = path.resolve(process.argv[2] ?? '.')
const entries = await Promise.all([
  exists(path.join(root, 'theme-pack.json')),
  exists(path.join(root, 'pet-pack.json')),
  exists(path.join(root, 'pi-harness-skin.json'))
])
let pkg = null
if (await exists(path.join(root, 'package.json'))) pkg = await validatePackageJson(root)
const harness = pkg ? readHarness(pkg) : { parts: [], partOf: null }
if (harness.partOf) {
  if (entries.some(Boolean)) throw new Error('A part package does not include its own manifest')
  await rejectUnsafeTree(root)
  await validatePartClips(root)
} else {
  if (!entries.some(Boolean)) throw new Error('No theme-pack.json, pet-pack.json, or pi-harness-skin.json')
  if (entries[0] || entries[1]) await rejectUnsafeTree(root)
  if (entries[0]) await validateTheme(root)
  if (entries[1]) await validatePet(root, harness.parts.length > 0)
  if (entries[2]) await validateSkin(root)
}
const eligible = pkg ? marketEligible(pkg.name) : false
console.log(JSON.stringify({ root, marketEligible: eligible, packageName: pkg?.name ?? null }, null, 2))

async function validateTheme(directory) {
  const manifest = validateThemePackManifest(JSON.parse(await readFile(path.join(directory, 'theme-pack.json'), 'utf8')))
  for (const file of declaredThemeAssets(manifest)) await assertInside(directory, file)
}

async function validatePet(directory, allowMissingClipDirs) {
  const manifest = validatePetPackManifest(JSON.parse(await readFile(path.join(directory, 'pet-pack.json'), 'utf8')))
  if (manifest.preview) {
    const preview = await assertInside(directory, manifest.preview)
    if (!isWebp(preview) && !isPng(preview) && !isJpeg(preview)) throw new Error('Pet preview is not a PNG, JPEG, or WebP')
  }
  for (const clip of Object.values(manifest.clips)) {
    if (allowMissingClipDirs && !(await isDirectory(path.join(directory, clip.dir)))) continue
    for (let index = 0; index < clip.frames; index += 1) {
      const relative = path.posix.join(clip.dir, frameFileName(clip.dir, index))
      const data = await assertInside(directory, relative)
      if (!isWebp(data)) throw new Error(`Frame is not WebP: ${relative}`)
    }
  }
}

async function validatePartClips(directory) {
  const pack = JSON.parse(await readFile(path.join(directory, 'clip-pack.json'), 'utf8'))
  if (pack?.formatVersion !== 1 || !pack.clips || typeof pack.clips !== 'object' || Array.isArray(pack.clips)) {
    throw new Error('A part package must include clip-pack.json')
  }
  const clips = path.join(directory, 'clips')
  const entries = await readdir(clips, { withFileTypes: true }).catch(() => [])
  const clipDirs = entries.filter((entry) => entry.isDirectory())
  const declared = Object.keys(pack.clips)
  if (!declared.length || declared.length !== clipDirs.length) {
    throw new Error('clip-pack.json must list every clip directory')
  }
  for (const [name, clip] of Object.entries(pack.clips)) {
    if (!/^[\w][\w.-]*$/.test(name) || clip?.dir !== `clips/${name}`) {
      throw new Error(`Invalid clip-pack entry: ${name}`)
    }
    const relative = path.posix.join('clips', name, frameFileName(name, 0))
    const data = await assertInside(directory, relative)
    if (!isWebp(data)) throw new Error(`Frame is not WebP: ${relative}`)
  }
}

async function validateSkin(directory) {
  const manifest = validateSkinManifest(JSON.parse(await readFile(path.join(directory, 'pi-harness-skin.json'), 'utf8')))
  for (const file of Object.values(manifest.assets ?? {})) {
    const data = await assertInside(directory, file)
    if (data.length > 12 * 1024 * 1024) throw new Error(`Skin asset exceeds 12 MiB: ${file}`)
  }
}

async function assertInside(directory, relative) {
  const resolved = path.resolve(directory, relative)
  if (!resolved.startsWith(path.resolve(directory) + path.sep) && resolved !== path.resolve(directory)) {
    throw new Error(`Path escapes the package: ${relative}`)
  }
  const info = await stat(resolved)
  if (!info.isFile()) throw new Error(`Missing file: ${relative}`)
  return readFile(resolved)
}

async function exists(file) {
  try {
    return (await lstat(file)).isFile()
  } catch {
    return false
  }
}

async function isDirectory(file) {
  try {
    return (await lstat(file)).isDirectory()
  } catch {
    return false
  }
}
