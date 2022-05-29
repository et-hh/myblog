const Config = require('markdown-it-chain')
const emojiPlugin = require('markdown-it-emoji') // https://blog.csdn.net/qq_41139830/article/details/85228748 emoji大全
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



    var afbdsa =1 ;

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
      return 
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
// markdown-it plugin for:
// 1. adding target="_blank" to external links
// 2. converting internal links to <router-link>

const url = require('url')

const indexRE = /(^|.*\/)(index|readme).md(#?.*)$/i

const convertRouterLinkPlugin = (md, externalAttrs) => {
  let hasOpenRouterLink = false
  let hasOpenExternalLink = false

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const { relPath } = env
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    if (hrefIndex >= 0) {
      const link = token.attrs[hrefIndex]
      const href = link[1]
      const isExternal = /^https?:/.test(href)
      const isSourceLink = /(\/|\.md|\.html)(#.*)?$/.test(href)
      if (isExternal || isSourceLink) {
        Object.entries(externalAttrs).forEach(([key, val]) => {
          token.attrSet(key, val)
        })
        if (/_blank/i.test(externalAttrs['target'])) {
          hasOpenExternalLink = true
        }
      } else if (isSourceLink) {
        hasOpenRouterLink = true
        tokens[idx] = toRouterLink(token, link, relPath)
      }
    }
    return self.renderToken(tokens, idx, options)
  }

  function toRouterLink (token, link, relPath) {
    link[0] = 'to'
    let to = link[1]

    // convert link to filename and export it for existence check
    md.$data = md.$data || {}
    const links = md.$data.links || (md.$data.links = [])
    links.push(to)

    // relative path usage.
    if (!to.startsWith('/')) {
      to = relPath
        ? url.resolve('/' + relPath, to)
        : ensureBeginningDotSlash(to)
    }

    const indexMatch = to.match(indexRE)
    if (indexMatch) {
      const [, path, , hash] = indexMatch
      to = path + hash
    } else {
      to = to
        .replace(/\.md$/, '.html')
        .replace(/\.md(#.*)$/, '.html$1')
    }

    // markdown-it encodes the uri
    link[1] = decodeURI(to)

    // export the router links for testing
    const routerLinks = md.$data.routerLinks || (md.$data.routerLinks = [])
    routerLinks.push(to)

    return Object.create(token, {
      tag: { value: 'router-link' }
    })
  }

  md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    if (hasOpenRouterLink) {
      token.tag = 'router-link'
      hasOpenRouterLink = false
    }
    if (hasOpenExternalLink) {
      hasOpenExternalLink = false
      // add OutBoundLink to the beforeend of this link if it opens in _blank.
      return '<OutboundLink/>' + self.renderToken(tokens, idx, options)
    }
    return self.renderToken(tokens, idx, options)
  }
}

const beginningSlashRE = /^\.\//

function ensureBeginningDotSlash (path) {
  if (beginningSlashRE.test(path)) {
    return path
  }
  return './' + path
}

// const convertRouterLinkPlugin = require('@vuepress/markdown/lib/link')
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
      console.log(e)
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

export const markdown = config.toMd(require('markdown-it'), {})

for (const type of ['tip', 'warning', 'danger']) {
  markdown.use(require('markdown-it-container'), type, {

    validate: function(params) {
      return new RegExp(`${type}`).test(params.trim());
    },

    render: (tokens, index) => {
      const token = tokens[index]
      let title = token.info.trim().slice(type.length).trim() || ''
      if (title) title = `<p class="custom-block-title">${title}</p>`
      if (token.nesting === 1) {
        return `<div class="${type} custom-block">${title}\n`
      } else {
        return `</div>\n`
      }
    }
  })
}

export default markdown

export const defaultMD = `---
title: 请输入文章标题
tags: [请输入文章标签]
---

请输入文章简介如：你好；组件库开始发布啦

<!-- more -->`
