/** Skin Protocol v1, matching skin.schema.json and Pi-Harness custom skin import. */
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/
const ASSET = /^(?![/\\])(?!.*(?:^|[/\\])\.\.(?:[/\\]|$)).+\.(?:png|jpe?g|webp)$/
const COLOR = /^(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla|oklch)\([^;{}]+\))$/
const TOKEN_KEYS = [
  'window', 'titlebar', 'sidebar', 'workspace', 'surface', 'surfaceRaised', 'hover', 'selected',
  'textPrimary', 'textSecondary', 'textTertiary', 'accent', 'accentHover', 'accentActive', 'accentBorder',
  'borderSubtle', 'borderDefault', 'borderStrong', 'controlBackground', 'controlBorder', 'controlBorderHover'
]

function plain(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function validateSkinManifest(value) {
  if (!plain(value)) throw new Error('Skin manifest must be an object')
  if (value.schemaVersion !== 1) throw new Error('Unsupported skin schemaVersion')
  if (typeof value.id !== 'string' || value.id.length < 2 || value.id.length > 64 || !ID.test(value.id)) {
    throw new Error('Invalid skin id')
  }
  if (typeof value.name !== 'string' || !value.name.trim() || value.name.length > 80) throw new Error('Invalid skin name')
  if (typeof value.version !== 'string' || !VERSION.test(value.version)) throw new Error('Invalid skin version')
  if (value.appearance !== 'dark' && value.appearance !== 'light') throw new Error('Invalid skin appearance')
  if (!plain(value.tokens)) throw new Error('Skin tokens are missing')
  for (const key of Object.keys(value.tokens)) {
    if (!TOKEN_KEYS.includes(key)) throw new Error(`Unknown skin token: ${key}`)
  }
  for (const key of TOKEN_KEYS) {
    const color = value.tokens[key]
    if (color === undefined) continue
    if (typeof color !== 'string' || color.length > 96 || !COLOR.test(color)) throw new Error(`Invalid skin token: ${key}`)
  }
  if (value.assets !== undefined) {
    if (!plain(value.assets)) throw new Error('Invalid skin assets')
    for (const [key, file] of Object.entries(value.assets)) {
      if (!['preview', 'wallpaper', 'portrait'].includes(key)) throw new Error(`Unknown skin asset: ${key}`)
      if (typeof file !== 'string' || file.length > 256 || !ASSET.test(file)) throw new Error(`Unsafe skin asset: ${key}`)
    }
  }
  return value
}

export { TOKEN_KEYS }
