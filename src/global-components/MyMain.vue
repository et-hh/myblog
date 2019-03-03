<template>
  <el-main
    class="my-main"
    :style="{marginLeft: mainLeft + 'px'}"
  >
    <content-header :content="content"></content-header>
    <keep-alive>
      <component
        :is="whichComponent"
        :content="content"
      ></component>
    </keep-alive>
  </el-main>
</template>
<script>
import ContentHeader from './ContentHeader'
export default {
  name: "Main",
  props: {
    isHide: {
      type: Boolean,
      default: false
    },
    content: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ContentHeader,
    All: () => import("@/components/All"),
    Posts: () => import("@/components/Posts"),
    Tags: () => import("@/components/Tags"),
    About: () => import("@/components/About"),
    Home: () => import("@/components/Home")
  },
  computed: {
    whichComponent() {
      let w = "";

      switch (this.$route.path.slice(1, 6)) {
        case "posts":
          w = "Posts";
          break;
        case "all/":
          w = "All";
          document.title = w // this.$themeConfig.menus.all + " · " + this.$site.title;
          break;
        case "tags/":
          w = "Tags";
          document.title = w // this.$themeConfig.menus.tags + "  ·  " + this.$site.title;
          break;
        case "about":
          w = "About";
          document.title = w // this.$themeConfig.menus.about + " · " + this.$site.title;
          break;
        default:
          w = "Home";
          document.title = w // this.$themeConfig.menus.home + " · " + this.$site.title;
      }
      if (this.$route.path.indexOf("/tags/") > -1 && !w) {
        w = "Tags";
        document.title =
          w +
          " · " +
          this.$route.params.tag
          // " · " +
          // this.$site.title;
      }
      return w;
    },
    mainLeft () {
      let l = 240;
      if (this.isHide) {
        l = 60;
      } else {
        l = 240;
      }
      return l;
    }
  }
};
</script>
<style lang="stylus" scoped>
.my-main {
  margin: 56px 0 0 240px;
  transition: 0.2s ease-in-out;
  padding: 0;
  overflow: hidden;
  padding-bottom: 113px;
  width: 100%;
}

@media (max-width: 1190px) {
  .my-main {
    margin-left: 0 !important;
  }
}
</style>