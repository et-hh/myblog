import Vue from 'vue'
import Vuex from 'vuex'

import { getPost } from '@/plugins/DB'
import { parseFrontmatter, markdown } from '@/plugins/markdown'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    post: {
      title: '',
      date: ''
    },
    posts: [],
    content: [],
    tagList: {},
    'x-csrf-token': ''
  },
  mutations: {
    setPost(state, { title, date }) {
      state.post.title = title
      state.post.date = date
    },
    setContent(state, content) {
      state.content = content
    },
    setTagList(state, tagList) {
      state.tagList = tagList
    },
    setToken(state, token) {
      state['x-csrf-token'] = token
    }
  },
  actions: {
    async loadPosts({ commit }) {
      const posts = await getPost()
      commit('setContent', posts.map((item) => {
        const { excerpt, data: { title, tags } } = parseFrontmatter(item.strippedContent)
        const lastUpdated = typeof item.updatedAt === 'object' ? item.updatedAt.format('yyyy-MM-dd hh:mm:ss')
          : new Date(item.updatedAt).format('yyyy-MM-dd hh:mm:ss')

        return  {
          tags,
          title,
          lastUpdated,
          'id': item._id,
          'excerpt': excerpt.trim(),
          'strippedContent': item.strippedContent
        }
      }))
      // const tagList = {}
      // posts.forEach((item, index) => {
      //   const { excerpt, content, data: { title, tags, date } } = parseFrontmatter(item)
      //   const lastUpdated = typeof date === 'object' ? date.format('yyyy-MM-dd hh:mm:ss')
      //     : date || new Date().format('yyyy-MM-dd hh:mm:ss')
      // // this.setPost({ title, date })

      // // return markdown.render(content)
      // tagList[] = {
      //     tags,
      //     title,
      //     lastUpdated,
      //     'id': index,
      //     'excerpt': excerpt.trim(),
      //     'strippedContent': content
      //   }
      // })
      // commit('setTagList', tagList)
    }
  },
  getters: {
    postTitle: state => state.post.title,
    postDate: state => state.post.date,
    posts: state => state.posts,
    content: state => state.content,
    'x-csrf-token': state => state['x-csrf-token']
  }
})