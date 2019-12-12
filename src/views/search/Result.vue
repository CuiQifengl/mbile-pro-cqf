<template>
  <div class="container">
    <!-- 导航固定定位 fixed -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <!-- 文章列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad">
      <van-cell-group>
        <van-cell v-for="item in articles" :key="item.art_id.toString()" :to="'/article/'+item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate | relativeTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
// 引入搜索结果的文章API
import { resoult } from '@/api/articles'
export default {
  name: 'searchResult',
  data () {
    return {
      loading: false,
      finished: false,
      // 查询的条件
      criteria: {
        page: 1,
        q: this.$route.query.q
      },
      // 搜索的文章
      articles: []
    }
  },
  methods: {
    // 加载数据
    async onLoad () {
      const data = await resoult(this.criteria)
      this.articles.push(...data.results)
      // 加载效果结束
      this.loading = false
      // 如果还有数据，翻页
      if (data.results.length) {
        this.criteria.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
