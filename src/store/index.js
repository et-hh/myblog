import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    post: {
      title: '',
      date: ''
    }
  },
  mutations: {
    setPost(state, { title, date }) {
      state.post.title = title
      state.post.date = date
    }
  },
  getters: {
    postTitle: state => state.post.title,
    postDate: state => state.post.date
  }
})