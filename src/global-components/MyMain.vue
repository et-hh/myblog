<template>
  <el-main
    class="my-main"
    ref="main"
    :style="{marginLeft: mainLeft + 'px'}"
  >
    <content-header :content="content"></content-header>
    <keep-alive>
      <component
        :is="whichComponent"
        :content="content"
        :minHeight="minHeight"
      ></component>
    </keep-alive>
  </el-main>
</template>
<script>
import ContentHeader from './ContentHeader'
import { mapGetters } from 'vuex'
export default {
  name: "Main",
  props: {
    isHide: {
      type: Boolean,
      default: false
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
  data() {
    return {
      minHeight: 0
    }
  },
  computed: {
    ...mapGetters(['content']),
    whichComponent() {
      let w = "";

      switch (this.$route.path.slice(1, 6)) {
        case "posts":
          w = "Posts";
          break;
        case "all/":
          w = "All";
          document.title = this.$themeConfig.menus.all + " · " + this.$site.title;
          break;
        case "tags/":
          w = "Tags";
          document.title = this.$themeConfig.menus.tags + "  ·  " + this.$site.title;
          break;
        case "about":
          w = "About";
          document.title = this.$themeConfig.menus.about + " · " + this.$site.title;
          break;
        default:
          w = "Home";
          document.title = this.$themeConfig.menus.home + " · " + this.$site.title;
      }
      if (this.$route.path.indexOf("/tags/") > -1 && !w) {
        w = "Tags";
        document.title =
          w +
          " · " +
          this.$route.params.tag
          " · " +
          this.$site.title;
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
  },
  mounted() {
    this.minHeight = this.$refs.main.$el.offsetHeight - 177 -113 + 34
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