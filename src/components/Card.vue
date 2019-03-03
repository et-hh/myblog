<template>
  <article class="card list-card" style="height: auto;">
    <div class="card__title">
      <div class="flex xs12">
        <router-link
          :to="item.path"
          class="headline post-title-link"
        >{{item.title}}</router-link>
        <div class="post-meta">
          <time :datetime="item.lastUpdated" class="secondary--text post-time">{{item.lastUpdated | dataFormat}}</time>
        </div>
      </div>
    </div>
    <div class="card__text pt-0 pb-0">
      <div class="flex xs12" v-html="item.excerpt"></div>
    </div>
    <div class="card__actions">
      <div class="flex xs12">
        <el-tag
          @click="toTaglist"
          v-for="(tag, index) in item.tags"
          :key="index"
          size="medium"
          :hit="true"
        >{{tag}}</el-tag>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  filters: {
    dataFormat(v) {
      try {
        return new Date(v).format('yyyy年MM月dd日')
      } catch (e) {
        return v
      }
    }
  },
  methods: {
    toTaglist (e) {
      this.$router.push("/tags/" + e.target.innerText);
    }
  },
  created() {
    Date.prototype.format = function(fmt) { 
      var o = { 
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
      }; 
      if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
      }
      for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
      }
      return fmt; 
    }
  }
}
</script>

<style lang="stylus" scoped>
.card__text {
  padding: 16px;
  width: 100%;
  font-size: 14px;
}

.headline {
  font-size: 24px!important;
  font-weight: 400;
  line-height: 32px!important;
  letter-spacing: normal!important;
}

.secondary--text {
  color: #6d6d6d !important;
}

.post-time {
  font-weight: 500;
}

.card__title {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
}

.card {
  display: block;
  border-radius: 2px;
  min-width: 0;
  position: relative;
  text-decoration: none;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
  background-color: #fff;
  color: rgba(0,0,0,.87);
  .card__title {
    padding-bottom: 0;
  }
  & > :first-child:not(.btn) {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }
  .flex {
    padding: 12px;
  }
}

.card__actions {
  align-items: center;
  display: flex;
  padding: 8px 12px;
}

@media (min-width: 0) {
  .flex.xs12 {
    flex-basis: 100%;
    flex-grow: 0;
    max-width: 100%;
  }
}
</style>
