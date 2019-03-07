import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Layout = () => import('../layouts/Layout.vue')

const router = new VueRouter({
  routes: [
    // { path: '/', component: () => import(/* webpackChunkName: "group-foo" */ './Foo.vue') },
    { path: '/', component: Layout },
    { path: '/all/', component: Layout },
    { path: '/about/', component: Layout },
    { path: '/tags/', component: Layout },
    { path: '/tags/:tag', component: Layout },
    { path: '/posts/:post', component: Layout },
    { path: '/posts/edit/:post', component: Layout }
  ]
})

router.beforeEach((to, from, next) => {
  if (typeof window === 'undefined') {
    return next()
  }
  if(!document.getElementById('loader-wrapper')) {
    next()
    return
  }
  document.getElementById('loader-wrapper').style.display = 'block'
  document.getElementById('loader-wrapper').style.opacity = '1'
  next()
})
router.afterEach(() => {
  if (typeof window === 'undefined') return
  if(!document.getElementById('loader-wrapper')) {
    return
  }
  document.getElementById('loader-wrapper').style.opacity = '0'

  setTimeout(() => {
    document.getElementById('loader-wrapper').style.display = 'none'
  }, 200)
})

export default router
