import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import './plugins/prototype.js'

import router from '@/router/routes'
import store from '@/store'

import '@/styles/element-variables.scss';
import '@/styles/iconfont.css';
import '@/styles/code.styl';
import '@/styles/content.styl';
import '@/styles/index.styl';

import OutboundLink from '@/components/OutboundLink.vue'
import TOC from '@/components/TOC.vue'
import Content from '@/components/Content'

Vue.config.productionTip = false

Vue.component('OutboundLink', OutboundLink)
Vue.component('Content', Content)
// markdown components
Vue.component('TOC', TOC)

Vue.prototype.$site = {
  title: 'Yiwise',
  description: '三人行，必有我师焉，择其善者而从之，其不善者而改之。'
}
Vue.prototype.$themeConfig = {
  placeholder: '搜搜看', //搜索框的默认文章
  searchReply: '什么都没搜到，试一下其它搜索词~',
  author: 'yiwise', //侧边栏的设置
  email: '1962421071@qq.com',
  pagination: '5', //每一页显示的文章个数
  avatar: '/logo.png', //头像地址
  brand: '/brand.jpg', //头像背景图片地址
  github: 'https://github.com/yiwise', //点击github跳转的地址
  vssue: {
    //评论的配置,
    need: true, //是否需要评论
    development: {
      //开发环境下的配置
      clientId: 'ad23c1ee34d09af2ef74',
      clientSecret: 'caeab887a04984b0963c34e02ee8a552719934ca',
      owner: 'zhouJiecode',
      repo: 'yiwiseComments',
      locale: 'zh'
    },
    production: {
      //生产环境的配置
      clientId: '229d75f31d318aa1c506',
      clientSecret: 'b89997e77f530f826369fc7104c97af0c664cc29',
      owner: 'zhouJiecode',
      repo: 'yiwiseComments',
      locale: 'zh'
    }
  },
  menus: {
    //侧边栏的文字
    tags: '标签分类',
    home: '分享',
    all: '时间归档',
    github: 'Github',
    about: '自我介绍'
  }
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
