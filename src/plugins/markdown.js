const Config = require('markdown-it-chain')
const emojiPlugin = require('markdown-it-emoji')
const anchorPlugin = require('markdown-it-anchor')
const escapeHtml = require("escape-html")
const prism = require('prismjs')
const loadLanguages = require('prismjs/components/index')
const grayMatter = require('gray-matter')
const toml = require('toml')

export function parseFrontmatter(content) {
  return grayMatter(content, {
      excerpt_separator: '<!-- more -->',
      engines: {
          toml: toml.parse.bind(toml),
          excerpt: false
      }
  });
}

function wrap (code, lang) {
  if (lang === 'text') {
    code = escapeHtml(code)
  }
  return `<pre v-pre class="language-${lang}"><code>${code}</code></pre>`
}

const highlight = (str, lang) => {
  if (!lang) {
    return wrap(str, 'text')
  }
  lang = lang.toLowerCase()
  const rawLang = lang
  if (lang === 'vue' || lang === 'html') {
    lang = 'markup'
  }
  if (lang === 'md') {
    lang = 'markdown'
  }
  if (lang === 'rb') {
    lang = 'ruby'
  }
  if (lang === 'ts') {
    lang = 'typescript'
  }
  if (lang === 'py') {
    lang = 'python'
  }
  if (lang === 'sh') {
    lang = 'bash'
  }
  if (lang === 'yml') {
    lang = 'yaml'
  }
  if (!prism.languages[lang]) {
    try {
      loadLanguages([lang])
    } catch (e) {
      logger.warn(`[vuepress] Syntax highlight for language "${lang}" is not supported.`)
    }
  }
  if (prism.languages[lang]) {
    const code = prism.highlight(str, prism.languages[lang], lang)
    return wrap(code, rawLang)
  }
  return wrap(str, 'text')
}

const fs = require("fs")
const path = require("path")
const snippetPlugin = function snippet (md, options = {}) {
  const fence = md.renderer.rules.fence
  const root = options.root || process.cwd()

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, , { loader }] = args
    const token = tokens[idx]
    const { src } = token
    if (src) {
      if (loader) {
        loader.addDependency(src)
      }
      if (fs.existsSync(src)) {
        token.content = fs.readFileSync(src, 'utf8')
      } else {
        token.content = 'Not found: ' + src
        token.info = ''
      }
    }
    return fence(...args)
  }

  function parser (state, startLine, endLine, silent) {
    const CH = '<'.charCodeAt(0)
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
      return false
    }

    for (let i = 0; i < 3; ++i) {
      const ch = state.src.charCodeAt(pos + i)
      if (ch !== CH || pos + i >= max) return false
    }

    if (silent) {
      return true
    }

    const start = pos + 3
    const end = state.skipSpacesBack(max, pos)
    const rawPath = state.src.slice(start, end).trim().replace(/^@/, root)
    const filename = rawPath.split(/[{\s]/).shift()
    const meta = rawPath.replace(filename, '')

    state.line = startLine + 1

    const token = state.push('fence', 'code', 0)
    token.info = filename.split('.').pop() + meta
    token.src = path.resolve(filename)
    token.markup = '```'
    token.map = [startLine, startLine + 1]

    return true
  }

  md.block.ruler.before('fence', 'snippet', parser)
}

const { PLUGINS, REQUIRED_PLUGINS } = require('@vuepress/markdown/lib/constant')
const componentPlugin = require('@vuepress/markdown/lib/component')
const preWrapperPlugin = require('@vuepress/markdown/lib/preWrapper')
// const snippetPlugin = require('@vuepress/markdown/lib/snippet')
const convertRouterLinkPlugin = require('@vuepress/markdown/lib/link')
const hoistScriptStylePlugin = md => {
  const RE = /^<(script|style)(?=(\s|>|$))/i

  md.renderer.rules.html_block = (tokens, idx) => {
    try {
      const content = tokens[idx].content

      // const hoistedTags = md.$data.hoistedTags || (md.$data.hoistedTags = [])
      if (RE.test(content.trim())) {
        // hoistedTags.push(content)
        return ''
      } else {
        return content
      }
    } catch(e) {
      return ''
    }
  }
}// require('@vuepress/markdown/lib/hoist')
const lineNumbersPlugin = require('@vuepress/markdown/lib/lineNumbers')
const tocPlugin = require('@vuepress/markdown/lib/tableOfContents')
const highlightLinesPlugin = require('@vuepress/markdown/lib/highlightLines')
// const highlight = require('@vuepress/markdown/lib/highlight')
const slugify = require('@vuepress/shared-utils/lib/slugify.js')
const externalLinks = undefined
const anchor = undefined
const toc = undefined

// using chainedAPI
const config = new Config()
config
  .options
    .html(true)
    .highlight(highlight)
    .end()

  .plugin(PLUGINS.COMPONENT)
    .use(componentPlugin)
    .end()

  .plugin(PLUGINS.HIGHLIGHT_LINES)
    .use(highlightLinesPlugin)
    .end()

  .plugin(PLUGINS.PRE_WRAPPER)
    .use(preWrapperPlugin)
    .end()

  .plugin(PLUGINS.SNIPPET)
    .use(snippetPlugin)
    .end()

  .plugin(PLUGINS.CONVERT_ROUTER_LINK)
    .use(convertRouterLinkPlugin, [Object.assign({
      target: '_blank',
      rel: 'noopener noreferrer'
    }, externalLinks)])
    .end()

  .plugin(PLUGINS.HOIST_SCRIPT_STYLE)
    .use(hoistScriptStylePlugin)
    .end()

  .plugin(PLUGINS.EMOJI)
    .use(emojiPlugin)
    .end()

  .plugin(PLUGINS.ANCHOR)
    .use(anchorPlugin, [{
      slugify,
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#'
    }])
    .end()

  .plugin(PLUGINS.TOC)
    .use(tocPlugin, [toc])
    .end()

  .plugin(PLUGINS.LINE_NUMBERS)
    .use(lineNumbersPlugin)
    .end()

const md1 = config.toMd(require('markdown-it'), {})

export default md1