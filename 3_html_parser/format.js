function splitHead (str, sep) {
  const idx = str.indexOf(sep)
  if (idx === -1) return [str]
  return [str.slice(0, idx), str.slice(idx + sep.length)]
}

function unquote (str) {
  const car = str.charAt(0)
  const end = str.length - 1
  const isQuoteStart = car === '"' || car === "'"
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end)
  }
  return str
}

module.exports = function format (nodes, options) {
  return nodes.map(node => {
    const type = node.type
    const outputNode = type === 'element'
      ? {
        type,
        tag: node.tagName.toLowerCase(),
        attributes: formatAttributes(node.attributes),
        children: format(node.children, options)
      }
      : { type, content: node.content }
    if (options.includePositions) {
      outputNode.position = node.position
    }
    return outputNode
  })
}

function formatAttributes (attributes) {
  const obj = {};
  attributes.forEach(attribute => {
    const parts = splitHead(attribute.trim(), '=')
    const key = parts[0]
    const value = typeof parts[1] === 'string'
      ? unquote(parts[1])
      : null
    obj.key = value;
  })
  return obj;
}
