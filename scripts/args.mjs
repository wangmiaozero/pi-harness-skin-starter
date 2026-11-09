export function options(argv = process.argv.slice(2)) {
  const flags = new Set()
  const values = {}
  const positionals = []
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index]
    if (!item.startsWith('--')) {
      positionals.push(item)
      continue
    }
    const name = item.slice(2)
    const next = argv[index + 1]
    if (next === undefined || next.startsWith('--')) flags.add(name)
    else {
      values[name] = next
      index += 1
    }
  }
  return { flags, values, positionals }
}
