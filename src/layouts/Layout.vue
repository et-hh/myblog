<template>
  <div style="height:100%">
    <el-container class="main-container">
      <my-aside :isHide="isHide"></my-aside>
      <el-container class="container-warp">
        <my-header
          @clickMenu="clickMenu"
          :restaurants="search"
          :showIcon="isHide"
        ></my-header>
        <my-main
          :isHide="isHide"
        ></my-main>
      </el-container>
      <go-top></go-top>
    </el-container>
    <my-footer
      :isHide="isHide"
    ></my-footer>
    <div
      @click="close"
      class="overlay"
      :class="{'overlay--active': needOverlay}"
    ></div>
  </div>
</template>
<script>
import { savePost, getPost } from '@/plugins/DB'
import MyAside from '@/global-components/MyAside'
import MyHeader from '@/global-components/MyHeader'
import MyMain from '@/global-components/MyMain'
import MyFooter from '@/global-components/MyFooter'
import GoTop from '@/global-components/GoTop'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "Layout",
  components: {
    MyAside,
    MyHeader,
    MyMain,
    MyFooter,
    GoTop
  },
  data () {
    return {
      isHide: false,
      needOverlay: false,
      search: []
    };
  },
  created () {
    this.loadPosts()
    import(/* webpackChunkName: "search" */ "@/data/search.js").then(search => {
      this.search = search.default;
    });
  },
  methods: {
    ...mapActions(['loadPosts']),
    clickMenu () {
      this.isHide = !this.isHide;
      if (typeof window === "undefined") return;
      if (window.innerWidth <= 1190) {
        this.needOverlay = !this.needOverlay;
      }
    },
    close () {
      this.needOverlay = !this.needOverlay;
      this.isHide = !this.isHide;
    }
  }
};
</script>
<style lang="stylus" scoped>
.main-container {
  min-height: 100%;
}

.container-warp {
  position: relative;
  overflow: hidden;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  transition: 0.5s cubic-bezier(0.25, 0.8, 0.5, 1);
  z-index: 35;
  position: absolute;
}

.overlay:before {
  position: absolute;
}

.overlay:before {
  background-color: #212121;
  bottom: 0;
  content: '';
  height: 100%;
  left: 0;
  opacity: 0;
  right: 0;
  top: 0;
  transition: inherit;
  transition-delay: 0.15s;
  width: 100%;
}

.overlay--active {
  pointer-events: auto;
  touch-action: none;
}

.overlay--active:before {
  opacity: 0.46;
}

.go-next {
  transform: rotateY(180deg) !important;
  right: 10px !important;
}
</style>
