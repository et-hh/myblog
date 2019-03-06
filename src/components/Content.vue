<template >
  <div ref="markedContent"></div>
</template>

<script>
import Vue from 'vue'
export default {
  props: ['domContent'],
  mounted () {
    this.compile()
  },
  watch: {
    domContent() {
      this.compile()
    }
  },
  methods: {
    compile () {
      // 在这里创建出一个子组件对象构造器。
      // console.log(this.domContent)
      const Component = Vue.extend({
        template: `<div class="content default"> ${this.domContent} </div>`
      })

      // new Component()是将上面构建的组件对象给实例化，
      // $mount()是将实例化的组件进行手动挂载，
      // 将虚拟dom生成出实际渲染的dom，
      // 这里的markedComponent是完成挂载以后的子组件
      const markedComponent = new Component().$mount()

      // 将挂载以后的子组件dom插入到父组件中
      // markedComponent.$el就是挂载后生成的渲染dom
      this.$refs['markedContent'].innerHTML = ''
      this.$refs['markedContent'].appendChild(markedComponent.$el)
    }
  }
}
</script>