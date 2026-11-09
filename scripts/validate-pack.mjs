import { lstat, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { isJpeg, isPng, isWebp } from './media.mjs'
import { marketEligible, rejectUnsafeTree, validatePackageJson } from './protocol/package.mjs'
import { frameFileName, validatePetPackManifest } from './protocol/pet.mjs'
import { validateSkinManifest } from './protocol/skin.mjs'
import { declaredThemeAssets, validateThemePackManifest } from './protocol/theme.mjs'

const root = path.resolve(process.argv[2] ?? '.')
const entries = await Promise.all([
  exists(path.join(root, 'theme-pack.json')),
  exists(path.join(root, 'pet-pack.json')),
  exists(path.join(root, 'pi-harness-skin.json'))
])
if (!entries.some(Boolean)) throw new Error('No theme-pack.json, pet-pack.json, or pi-harness-skin.json')
if (entries[0] || entries[1]) await rejectUnsafeTree(root)
let pkg = null
if ((entries[0] || entries[1]) && (await exists(path.join(root, 'package.json')))) pkg = await validatePackageJson(root)
if (entries[0]) await validateTheme(root)
if (entries[1]) await validatePet(root)
if (entries[2]) await validateSkin(root)
const eligible = pkg ? marketEligible(pkg.name) : false
console.log(JSON.stringify({ root, marketEligible: eligible, packageName: pkg?.name ?? null }, null, 2))

async function validateTheme(directory) {
  const manifest = validateThemePackManifest(JSON.parse(await readFile(path.join(directory, 'theme-pack.json'), 'utf8')))
  for (const file of declaredThemeAssets(manifest)) await assertInside(directory, file)
}

async function validatePet(directory) {
  const manifest = validatePetPackManifest(JSON.parse(await readFile(path.join(directory, 'pet-pack.json'), 'utf8')))
  if (manifest.preview) {
    const preview = await assertInside(directory, manifest.preview)
    if (!isWebp(preview) && !isPng(preview) && !isJpeg(preview)) throw new Error('Pet preview is not a PNG, JPEG, or WebP')
  }
  for (const clip of Object.values(manifest.clips)) {
    for (let index = 0; index < clip.frames; index += 1) {
      const relative = path.posix.join(clip.dir, frameFileName(clip.dir, index))
      const data = await assertInside(directory, relative)
      if (!isWebp(data)) throw new Error(`Frame is not WebP: ${relative}`)
    }
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
