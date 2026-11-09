import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { validateThemePackManifest } from './protocol/theme.mjs'
import { validatePetPackManifest } from './protocol/pet.mjs'
import { frameFileName } from './protocol/pet.mjs'

const root = path.resolve(process.argv[2] ?? '.')
const previewRoot = path.join(root, '.preview')
await mkdir(previewRoot, { recursive: true })
if (await readable(path.join(root, 'theme-pack.json'))) await previewTheme(root, previewRoot)
else if (await readable(path.join(root, 'pet-pack.json'))) await previewPet(root, previewRoot)
else throw new Error('Preview needs theme-pack.json or pet-pack.json')

async function previewTheme(directory, output) {
  const manifest = validateThemePackManifest(JSON.parse(await readFile(path.join(directory, 'theme-pack.json'), 'utf8')))
  const images = [manifest.preview, ...manifest.variants.flatMap((variant) => [variant.portraitAsset, ...Object.values(variant.cssImages ?? {})])]
    .filter(Boolean)
  const cards = []
  for (const file of images) {
    const data = await readFile(path.join(directory, file))
    cards.push(`<figure><img alt="${file}" src="${dataUrl(file, data)}"><figcaption>${file}</figcaption></figure>`)
  }
  await writeHtml(output, manifest.name, cards.join('\n'))
}

async function previewPet(directory, output) {
  const manifest = validatePetPackManifest(JSON.parse(await readFile(path.join(directory, 'pet-pack.json'), 'utf8')))
  const sections = []
  for (const [name, clip] of Object.entries(manifest.clips)) {
    const frames = []
    const limit = Math.min(clip.frames, 12)
    for (let index = 0; index < limit; index += 1) {
      const relative = path.posix.join(clip.dir, frameFileName(clip.dir, index))
      const data = await readFile(path.join(directory, relative))
      frames.push(dataUrl(relative, data))
    }
    sections.push(`<section><h2>${name}</h2><img data-frames='${JSON.stringify(frames)}' data-fps="${manifest.fps}" alt="${name}"></section>`)
  }
  await writeHtml(
    output,
    manifest.name,
    `${sections.join('\n')}<script>for (const image of document.querySelectorAll('[data-frames]')) { const frames = JSON.parse(image.dataset.frames); let index = 0; image.src = frames[0]; setInterval(() => { index = (index + 1) % frames.length; image.src = frames[index] }, 1000 / Number(image.dataset.fps || 8)) }</script>`
  )
}

function dataUrl(file, data) {
  const type = file.endsWith('.png') ? 'image/png' : file.endsWith('.jpg') || file.endsWith('.jpeg') ? 'image/jpeg' : 'image/webp'
  return `data:${type};base64,${data.toString('base64')}`
}

async function writeHtml(output, title, body) {
  const file = path.join(output, 'index.html')
  await writeFile(file, `<!doctype html><meta charset="utf-8"><title>${title}</title><style>body{font:14px sans-serif;background:#17181b;color:#ececf0}img{max-width:240px;background:#111}</style><h1>${title}</h1>${body}`)
  console.log(file)
}

async function readable(file) {
  try {
    await readFile(file)
    return true
  } catch {
    return false
  }
}
