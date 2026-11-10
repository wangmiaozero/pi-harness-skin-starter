import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { options } from './args.mjs'
import { validatePackageJson, rejectUnsafeTree } from './protocol/package.mjs'
import { zipFiles } from './zip.mjs'

const parsed = options()
const root = path.resolve(parsed.positionals[0] ?? '.')
const destination = path.resolve(parsed.values.out ?? path.join(root, '..'))
const pkg = await validatePackageJson(root)
await rejectUnsafeTree(root)
const files = await listedFiles(root)
if (parsed.flags.has('write')) {
  await mkdir(destination, { recursive: true })
  const filename = `${path.basename(root)}-v${pkg.version}.zip`
  const { zip } = zipFiles(await Promise.all(files.map(async (name) => ({ name, data: await readFile(path.join(root, name)) }))))
  await writeFile(path.join(destination, filename), zip)
}
console.log(JSON.stringify({ name: pkg.name, version: pkg.version, files: files.length }, null, 2))

async function listedFiles(directory, prefix = '') {
  const { readdir } = await import('node:fs/promises')
  const found = []
  for (const entry of await readdir(path.join(directory, prefix), { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.preview') continue
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) found.push(...(await listedFiles(directory, relative)))
    else found.push(relative)
  }
  return found
}
