<template>
    <van-popup  :value="value" @input="$emit('input',$event)"  @open="isReport=false" >
      <van-cell-group v-if="!isReport">
      <van-cell @click="disLike">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell>侵权</van-cell>
      <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell>
    </van-cell-group>
    </van-popup>
</template>

<script>
// 调用不喜欢文章的API
import { disLike } from '@/api/articles'
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
      isReport: false
    }
  },
  methods: {
    // 点击不喜欢，成功删除文章
    async disLike () {
      await disLike(this.articleId)
      // 成功
      this.$toast.success('删除成功')
      this.$emit('input', false)
      // 通知父组件删除文章
      this.$emit('del')
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
