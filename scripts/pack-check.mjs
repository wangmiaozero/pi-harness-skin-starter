import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { options } from './args.mjs'

const parsed = options()
const root = path.resolve(parsed.positionals[0] ?? '.')
const destination = path.resolve(parsed.values.out ?? path.join(root, '..'))
const child = spawn('npm', ['pack', '--dry-run', '--json'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })
let stdout = ''
let stderr = ''
child.stdout.on('data', (chunk) => {
  stdout += chunk
})
child.stderr.on('data', (chunk) => {
  stderr += chunk
})
const code = await new Promise((resolve) => child.on('close', resolve))
if (code !== 0) throw new Error(stderr || stdout || 'npm pack --dry-run failed')
const packed = JSON.parse(stdout)
const entry = Array.isArray(packed) ? packed[0] : packed
const files = (entry.files ?? []).map((file) => file.path ?? file.name)
if (files.some((file) => file.endsWith('.js') || file.endsWith('.mjs') || file.includes('..'))) {
  throw new Error('Tarball contains an unsafe file')
}
if (parsed.flags.has('write')) {
  await mkdir(destination, { recursive: true })
  const write = spawn('npm', ['pack', '--pack-destination', destination], { cwd: root, stdio: 'inherit' })
  const writeCode = await new Promise((resolve) => write.on('close', resolve))
  if (writeCode !== 0) throw new Error('npm pack failed')
  const body = await readFile(path.join(destination, entry.filename))
  if (body.length < 32) throw new Error('Tarball is empty')
}
console.log(JSON.stringify({ name: entry.name, version: entry.version, filename: entry.filename, files: files.length, shasum: entry.shasum, bytes: parsed.flags.has('write') ? (await readFile(path.join(destination, entry.filename))).length : undefined }, null, 2))
