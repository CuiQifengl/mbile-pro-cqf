<template>
  <div class="container" @scroll="rember($event)" ref="container">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail" v-if="articles">
      <h3 class="title">{{articles.title}}</h3>
      <div class="author">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
         :src="articles.aut_photo"
        />
        <div class="text">
          <p class="name">{{articles.aut_name}}</p>
          <p class="time">{{articles.pubdate|relativeTime}}</p>
        </div>
        <van-button round size="small" type="info">+ 关注</van-button>
      </div>
      <div class="content" v-html="articles.content">
        <!-- <p>{{articles.content}}</p> -->
      </div>
      <div class="zan">
        <van-button round size="small" class="active" plain icon="like-o">点赞</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { details } from '@/api/articles'
export default {
  name: 'articlelist',
  data () {
    return {
      articles: {
        art_id: ''
      },
      scrollTop: ''
    }
  },
  activated () {
    if (this.$route.params.id !== this.articles.art_id.toString()) {
      this.scrollTop = 0
      this.getarticles()
    } else {
      // 滚动到记忆的位置
      this.$refs['container'].scrollTop = this.scrollTop
    }
  },
  methods: {
    // 记住位置
    rember (e) {
      this.scrollTop = e.target.scrollTop
    },
    async getarticles () {
      const data = await details(this.$route.params.id)
      this.articles = data
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  height: 1000%;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  // 内容中包含：img 特别宽  code pre 不能换行
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
    /deep/ pre{
      white-space: pre-wrap;
    }
  }
}
</style>
