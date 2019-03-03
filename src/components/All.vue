<template>
  <div class="all-warp">
    <div
      v-for="(item, index) in poList"
      :key="index"
    >
      <h3>{{item[0]}}</h3>
      <el-row
        type="flex"
        justify="center"
        align="middle"
        class="post-warp"
      >
        <template v-for="(post,i) in item">
          <el-col
            :span="20"
            :xs="{span:23}"
            :sm="{span:23}"
            :md="{span:23}"
            :lg="{span:20}"
            :key="i"
            v-if="i !== 0"
            class="post post-card"
          >
            <Card :item="post"></Card>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>
<script>
import Card from './Card'
import poList from '@/data/poList.js'
export default {
  name: "All",
  title: '时间归档',
  components: { Card },
  data () {
    return {
      poList: poList
    };
  },
  props: {
    content: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style lang="stylus" scoped>
.all-warp {
  margin-top: 15px;

  h3 {
    color: #3f51b5;
    font-size: 20px;
    text-align: center;
  }
}

.post-warp {
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.post {
  margin: 10px;
}

@media (min-width: 1190px) {
  .post-card {
    width: 83.33333%;
  }
}
</style>