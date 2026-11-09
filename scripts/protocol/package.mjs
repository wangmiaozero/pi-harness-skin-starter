import { lstat, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

export const MARKET_PACKAGE_NAME = /^@piharness\/(theme|pet)-[a-z0-9][a-z0-9-]*$/
const PART_PACKAGE_NAME = /^@(?:piharness|example)\/(?:theme|pet)-[a-z0-9][a-z0-9-]*$/
const EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.mp4', '.mp3', '.json', '.md', '.txt'])
const BARE = new Set(['license', 'notice', 'readme.md'])

export function marketEligible(name) {
  return MARKET_PACKAGE_NAME.test(name)
}

export async function validatePackageJson(root) {
  const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
  if (typeof pkg.name !== 'string' || !pkg.name.trim()) throw new Error('package.json is missing name')
  if (typeof pkg.version !== 'string' || !/^\d+\.\d+\.\d+/.test(pkg.version)) throw new Error('package.json version is invalid')
  if (pkg.scripts && Object.keys(pkg.scripts).length) throw new Error('Resource packages cannot contain npm scripts')
  if (pkg.dependencies || pkg.devDependencies || pkg.optionalDependencies) {
    throw new Error('Resource packages cannot depend on other packages')
  }
  const text = JSON.stringify(pkg)
  if (text.includes('/Users/') || text.includes('C:\\')) throw new Error('package.json contains a local absolute path')
  readHarness(pkg)
  return pkg
}

/** A package is a main package unless `piHarness.partOf` names its main package. */
export function readHarness(pkg) {
  const harness = pkg.piHarness
  if (!harness || typeof harness !== 'object' || Array.isArray(harness)) {
    return { parts: [], partOf: null }
  }
  const { parts, partOf } = harness
  if (parts !== undefined && partOf !== undefined) {
    throw new Error('piHarness.parts and piHarness.partOf cannot both be set')
  }
  if (partOf !== undefined) {
    if (typeof partOf !== 'string' || !PART_PACKAGE_NAME.test(partOf) || partOf === pkg.name) {
      throw new Error('piHarness.partOf must name the main theme or pet package')
    }
    return { parts: [], partOf }
  }
  if (parts !== undefined) {
    if (!Array.isArray(parts) || parts.length < 1 || parts.length > 8) {
      throw new Error('piHarness.parts must list 1 to 8 package names')
    }
    for (const name of parts) {
      if (typeof name !== 'string' || !PART_PACKAGE_NAME.test(name) || name === pkg.name || parts.indexOf(name) !== parts.lastIndexOf(name)) {
        throw new Error(`piHarness.parts entry is invalid: ${name}`)
      }
    }
    return { parts, partOf: null }
  }
  return { parts: [], partOf: null }
}

export async function rejectUnsafeTree(root) {
  const entries = await walk(root)
  for (const relative of entries) {
    const full = path.join(root, relative)
    const stat = await lstat(full)
    if (stat.isSymbolicLink()) throw new Error(`Symlink is not allowed: ${relative}`)
    if (!stat.isFile()) continue
    const base = path.basename(relative).toLowerCase()
    const extension = path.extname(relative).toLowerCase()
    if (BARE.has(base)) continue
    if (!EXTENSIONS.has(extension)) throw new Error(`File type is not allowed: ${relative}`)
    if (['.js', '.mjs', '.cjs', '.sh', '.html', '.svg', '.exe'].includes(extension)) {
      throw new Error(`Executable or active content is not allowed: ${relative}`)
    }
  }
}

async function walk(root, prefix = '') {
  const found = []
  for (const entry of await readdir(path.join(root, prefix), { withFileTypes: true })) {
    if (entry.name === '.preview' || entry.name === 'node_modules') continue
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) found.push(...(await walk(root, relative)))
    else found.push(relative)
  }
  return found
}
