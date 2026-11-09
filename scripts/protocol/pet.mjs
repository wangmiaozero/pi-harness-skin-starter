/** Pet Pack checks used by Pi-Harness load and import. */
export const MAX_CLIPS = 256
export const MAX_FRAMES_PER_CLIP = 1024
const PACK_ID = /^[\w-]{1,64}$/
const CLIP_KEY = /^[\w][\w.-]*$/
const CLIP_DIR = /^(clips\/)?[\w][\w.-]*$/

function plain(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function validatePetPackManifest(value) {
  if (!plain(value)) throw new Error('Pet pack manifest must be an object')
  if (!plain(value.clips)) throw new Error('Pet pack manifest is missing clips')
  const keys = Object.keys(value.clips)
  if (!keys.length || keys.length > MAX_CLIPS) throw new Error('Pet pack has an invalid clip count')
  const clips = {}
  for (const [name, raw] of Object.entries(value.clips)) {
    if (!CLIP_KEY.test(name) || name.length > 64) throw new Error(`Pet pack clip "${name}" has an unsafe or malformed entry`)
    if (!plain(raw)) throw new Error(`Pet pack clip "${name}" has an unsafe or malformed entry`)
    const dir = typeof raw.dir === 'string' && raw.dir ? raw.dir : name
    if (!CLIP_DIR.test(dir) || dir.includes('..')) throw new Error(`Pet pack clip "${name}" has an unsafe or malformed entry`)
    if (typeof raw.frames !== 'number' || !Number.isInteger(raw.frames) || raw.frames <= 0 || raw.frames > MAX_FRAMES_PER_CLIP) {
      throw new Error(`Pet pack clip "${name}" has an invalid frame count`)
    }
    if (raw.frameDurationsMs !== undefined) {
      const durations = raw.frameDurationsMs
      if (
        !Array.isArray(durations) ||
        durations.length !== raw.frames ||
        durations.some((item) => typeof item !== 'number' || !Number.isFinite(item) || item < 16 || item > 10000)
      ) {
        throw new Error(`Pet pack clip "${name}" has invalid frame durations`)
      }
    }
    clips[name] = { dir, frames: raw.frames, loop: raw.loop !== false }
  }
  if (typeof value.baseWidth !== 'number' || value.baseWidth <= 0) throw new Error('Invalid pack baseWidth')
  if (typeof value.baseHeight !== 'number' || value.baseHeight <= 0) throw new Error('Invalid pack baseHeight')
  if (typeof value.fps !== 'number' || value.fps <= 0 || value.fps > 60) throw new Error('Invalid pack fps')
  for (const key of ['id', 'name', 'nameEn', 'author', 'version', 'license']) {
    if (typeof value[key] !== 'string' || !value[key]) throw new Error(`Pet pack manifest is missing "${key}"`)
  }
  if (!PACK_ID.test(value.id)) throw new Error(`Pet pack id "${value.id}" is not a valid pack id`)
  if (!clips.idle && !value.defaultAnimation) throw new Error('Pet pack has no idle or default animation')
  if (value.defaultAnimation !== undefined && !clips[value.defaultAnimation]) {
    throw new Error('Pet pack defaultAnimation does not reference a declared clip')
  }
  if (value.agentStateMapping !== undefined) {
    if (!plain(value.agentStateMapping)) throw new Error('Pet pack manifest has an invalid "agentStateMapping" entry')
    for (const [state, clip] of Object.entries(value.agentStateMapping)) {
      if (!CLIP_KEY.test(state) || !CLIP_KEY.test(clip) || !clips[clip]) {
        throw new Error(`Pet pack agentStateMapping entry "${state}" is invalid`)
      }
    }
  }
  if (value.preview !== undefined && !/^[\w][\w.-]*\.(png|webp|jpe?g)$/.test(value.preview)) {
    throw new Error('Pet pack manifest has an invalid "preview" entry')
  }
  return value
}

export function frameFileName(clipDir, index) {
  const name = clipDir.split('/').pop()
  return `${name}_${String(index + 1).padStart(3, '0')}.webp`
}
