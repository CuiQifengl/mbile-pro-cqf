<template>
  <van-popup :value="value" @input="$emit('input',false)" @open="isReport=false">
    <van-cell-group v-if="!isReport">
      <van-cell @click="disLike">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell
        icon="info-o"
        v-for="item in report"
        :key="item.value"
        @click="reports(item.value)"
      >{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
// 调用不喜欢文章的API 调用举报API
import { disLike, reports } from '@/api/articles'
// 调用常量
import { report } from '@/api/constant'
export default {
  name: 'more-active',
  props: {
    // 接收父组件的value值
    value: {
      type: Boolean,
      default: false
    },
    // 当前文章ID
    articleId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      show: false,
      isReport: false,
      report
    }
  },
  methods: {
    // 点击不喜欢，成功删除文章
    // async disLike () {
    //   await disLike(this.articleId)
    //   // 成功
    //   this.$toast.success('删除成功')
    //   this.$emit('input', false)
    //   // 告诉父组件删除这个文章
    //   this.$emit('del')
    // },
    async disLike () {
      try {
        await disLike(this.articleId)
        // 成功
        this.$toast.success('删除成功')
        // 关闭遮造层
        this.$emit('input', false)
        // 通知父组件删除文章
        this.$emit('del')
      } catch (e) {
        this.$toast.fail('删除成功')
      }
    },
    // // 举报文章
    async reports (type) {
      try {
        await reports(this.articleId, type)
        // 成功
        this.$toast.success('删除成功')
        this.$emit('input', false)
        // 通知父组件删除文章
        this.$emit('des')
      } catch (e) {

      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
