/** Theme Pack Protocol v1. Keep these checks aligned with Pi-Harness validateThemePackManifest. */
export const THEME_FORMAT_VERSION = 1
const PACK_ID = /^[a-z0-9][a-z0-9-]*$/
const STYLE_ID = /^[A-Za-z][A-Za-z0-9]*$/
const SKIN_ID = /^[a-z0-9][a-z0-9-]*$/
const ASSET = /^(?:[\w][\w.-]*)(?:\/[\w][\w.-]*)*$/
const CSS_VAR = /^--[a-z0-9-]+$/

function plain(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asset(value, label) {
  if (typeof value !== 'string' || !ASSET.test(value)) throw new Error(`Unsafe theme asset: ${label}`)
  return value
}

export function validateThemePackManifest(value) {
  if (!plain(value)) throw new Error('Theme pack manifest must be an object')
  if (value.formatVersion !== THEME_FORMAT_VERSION) throw new Error('Unsupported theme pack format')
  if (typeof value.id !== 'string' || !PACK_ID.test(value.id)) throw new Error('Invalid theme pack id')
  for (const key of ['name', 'version', 'author', 'description', 'license', 'compatiblePiHarness']) {
    const field = value[key]
    if (typeof field !== 'string' || !field.trim() || field.length > 400) throw new Error(`Invalid theme pack ${key}`)
  }
  const preview = asset(value.preview, 'preview')
  if (!Array.isArray(value.variants) || value.variants.length < 1 || value.variants.length > 16) {
    throw new Error('Theme pack variants are invalid')
  }
  const variants = value.variants.map((raw) => {
    if (!plain(raw)) throw new Error('Theme variant must be an object')
    if (typeof raw.id !== 'string' || !STYLE_ID.test(raw.id)) throw new Error('Invalid theme variant id')
    if (typeof raw.skinId !== 'string' || !SKIN_ID.test(raw.skinId)) throw new Error('Invalid theme skin id')
    if (typeof raw.name !== 'string' || !raw.name.trim()) throw new Error('Invalid theme variant name')
    if (raw.appearance !== 'dark' && raw.appearance !== 'light') throw new Error('Invalid theme appearance')
    if (typeof raw.portrait !== 'boolean') throw new Error('Invalid theme portrait flag')
    if (typeof raw.accent !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(raw.accent)) throw new Error('Invalid theme accent')
    for (const dimension of ['frameWidth', 'frameHeight']) {
      const size = raw[dimension]
      if (typeof size !== 'number' || !Number.isInteger(size) || size < 1 || size > 8192) {
        throw new Error('Invalid theme frame size')
      }
    }
    const variant = {
      id: raw.id,
      skinId: raw.skinId,
      name: raw.name,
      appearance: raw.appearance,
      portrait: raw.portrait,
      accent: raw.accent,
      frameWidth: raw.frameWidth,
      frameHeight: raw.frameHeight
    }
    if (raw.portraitAsset !== undefined) variant.portraitAsset = asset(raw.portraitAsset, 'portrait')
    if (raw.startup !== undefined) {
      if (typeof raw.startup !== 'boolean') throw new Error('Invalid theme startup flag')
      variant.startup = raw.startup
    }
    if (raw.cssImages !== undefined) {
      if (!plain(raw.cssImages)) throw new Error('Invalid theme image map')
      variant.cssImages = {}
      for (const [key, file] of Object.entries(raw.cssImages)) {
        if (!CSS_VAR.test(key)) throw new Error('Invalid theme CSS variable')
        variant.cssImages[key] = asset(file, key)
      }
    }
    return variant
  })
  let startup
  if (value.startup !== undefined) {
    if (!plain(value.startup)) throw new Error('Invalid theme startup map')
    startup = {}
    for (const [key, file] of Object.entries(value.startup)) {
      if (!/^[\w][\w.-]*$/.test(key)) throw new Error('Invalid startup asset key')
      startup[key] = asset(file, key)
    }
  }
  return {
    formatVersion: 1,
    id: value.id,
    name: value.name,
    version: value.version,
    author: value.author,
    description: value.description,
    license: value.license,
    compatiblePiHarness: value.compatiblePiHarness,
    preview,
    variants,
    startup
  }
}

export function declaredThemeAssets(manifest) {
  const files = new Set([manifest.preview])
  for (const variant of manifest.variants) {
    if (variant.portraitAsset) files.add(variant.portraitAsset)
    for (const file of Object.values(variant.cssImages ?? {})) files.add(file)
  }
  for (const file of Object.values(manifest.startup ?? {})) files.add(file)
  return [...files]
}
