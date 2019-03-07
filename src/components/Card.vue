<template>
  <article class="card list-card" style="height: auto;">
    <div class="card__title">
      <div class="flex xs12">
        <router-link
          :to="'/posts/' + item.id"
          class="headline post-title-link"
        >{{item.title}}</router-link>
        <div class="post-meta">
          <time :datetime="item.lastUpdated" class="secondary--text post-time">{{item.lastUpdated | dataFormat}}</time>
        </div>
      </div>
      <a href="javascript: void 0" class="del-icon" @click="delItem"><i class="el-icon-close"></i></a>
      <a href="javascript: void 0" class="edit-icon" @click="editItem"><i class="el-icon-edit"></i></a>
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
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px">
      <div class="confirm-info">确认删除该项？删除后将无法恢复</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDel">确 定</el-button>
      </span>
    </el-dialog>
  </article>
</template>

<script>
import { delPost } from "@/plugins/DB"
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false
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
    ...mapActions(['loadPosts']),
    toTaglist (e) {
      this.$router.push("/tags/" + e.target.innerText);
    },
    delItem() {
      this.dialogVisible = true
    },
    editItem() {
      this.$router.push('/posts/edit/' + this.item.id)
    },
    handleDel() {
      delPost(this.item.id)

      this.dialogVisible = false
      this.$message.success('删除成功')
      this.loadPosts()
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

.edit-icon, .del-icon {
  position: absolute;
  right: 25px;
  top: 25px;
  font-size: 20px;
  display: none;
}

.edit-icon {
  right: 50px;
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
  &:hover {
    .del-icon, .edit-icon {
      display: block;
    }
  }
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
