const lexer = require('./lexer.js')
const parser = require('./parser.js')
const format = require('./format.js')
const {
  voidTags,
  closingTags,
  childlessTags,
  closingTagAncestorBreakers
} = require('./tags')
const parseDefaults = {
  voidTags,
  closingTags,
  childlessTags,
  closingTagAncestorBreakers
}
function parse(str, options = parseDefaults) {
  const tokens = lexer(str, options)
  // console.log('tokens',tokens)
  const nodes = parser(tokens, options)
  // console.log('nodes',nodes)
  return format(nodes, options)
}

const html = '<div a="abc">Hello world<span></span>666</div>'
// const html = '<img a="abc" />'
const json = parse(html)
console.log(json)