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
    tagList: {}
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
    }
  },
  actions: {
    loadPosts({ commit }) {
      const posts = getPost()
      commit('setContent', posts.map((item, index) => {
        const { excerpt, content, data: { title, tags, date } } = parseFrontmatter(item)
        const lastUpdated = typeof date === 'object' ? date.format('yyyy-MM-dd hh:mm:ss')
          : date || new Date().format('yyyy-MM-dd hh:mm:ss')

        return  {
          tags,
          title,
          lastUpdated,
          'id': index,
          'excerpt': excerpt.trim(),
          'strippedContent': item
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
    content: state => state.content
  }
})