<template>
  <div class="container">
    <van-tabs swipeable v-model="channelIndex" :lazy-render="false" @change="changeChannel">
      <van-tab :key="channel.id" v-for="channel in myChannel" :title="channel.name">
        <div class="scroll-wrapper" @scroll="remmber($event)" ref="scroll-wrapper">
          <van-cell-group>
            <van-pull-refresh
              v-model="channel.downLoading"
              @refresh="onRefresh"
              :success-text="successText"
            >
              <van-list
                v-model="channel.upLoading"
                :finished="channel.finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <van-cell v-for="item in channel.articles" :key="item.art_id.toString()" :to="'/article/'+item.art_id.toString()">
                  <div class="article_item">
                    <h3 class="van-ellipsis">{{item.title}}</h3>
                    <div class="img_box" v-if="item.cover.type===3">
                      <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                      <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                      <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
                    </div>
                    <div class="img_box" v-if="item.cover.type===1">
                      <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
                    </div>
                    <div class="info_box">
                      <span>{{item.aut_name}}</span>
                      <span>{{item.comm_count}}评论</span>
                      <span>{{item.pubdate |relativeTime}}</span>
                      <span class="close" v-if="user.token" @click.stop="openMoreActive(item.art_id.toString())">
                        <van-icon name="cross"></van-icon>
                      </span>
                    </div>
                  </div>
                </van-cell>
              </van-list>
            </van-pull-refresh>
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right" @click="openchannelEdit">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 更多操作 -->
    <more-active
    v-if="user.token"
     :articleId="articleId"
     :value="showMoreActive"
     @input="showMoreActive=false"
     @del="removeArticle"
     @des="removeArticle"
     ></more-active>
     <!-- 频道编辑 -->
     <channel-edit v-model="showChannel" :myChannel="myChannel" :channelIndex="channelIndex"></channel-edit>
  </div>
</template>

<script>
// 引入获取频道api
import { getChannels } from '@/api/channel'
// 引入文章列表api
import { getArticles } from '@/api/articles'
// vuex中的数据
import { mapState } from 'vuex'
// 引入more-active组件
import moreActive from './components/more-active'
// 引入编辑频道组件
import channelEdit from './components/channel-edit'
export default {
  name: 'home',
  components: { moreActive, channelEdit },
  data () {
    return {
      // // 加载效果,false加载结束
      // upLoading: false,
      // // 加载完成，false还有数据
      // finished: false,
      // articles: [],
      // // 刷新效果，flase刷新结束
      // downLoading: false,
      // // 刷新完成提示文案
      successText: '',
      // 频道
      myChannel: [],
      // 当前激活频道索引
      channelIndex: 0,
      // 父组件显示更多操作
      showMoreActive: false,
      // 文章的id
      articleId: null,
      // 展示频道编辑
      showChannel: false
    }
  },
  created () {
    this.getChannels()
    // this.getMyChannels()
  },
  computed: {
    // 获取到当前激活的频道
    activeChannel () {
      return this.myChannel[this.channelIndex]
    },
    ...mapState(['user'])
  },
  // 监听resfersh-taken的变化
  watch: {
    'user.refresh_token' () {
      this.channelIndex = 0
      this.getChannels()
      this.onLoad()
    }
  },
  // 当激活该频道时，要显示上次记录位置
  activated () {
    // 严谨处理，因为初始化时么有拿到dom
    if (this.$refs['scroll-wrapper']) {
      const dom = this.$refs['scroll-wrapper'][this.channelIndex]
      dom.scrollTop = this.activeChannel.scrollTop
    }
  },
  methods: {
    // 打开频道编辑
    openchannelEdit () {
      this.showChannel = true
    },
    // 删除文章
    removeArticle () {
      const article = this.activeChannel.articles
      const index = article.findIndex(item => {
        return item.art_id.toString() === this.articleId
      })
      article.splice(index, 1)
    },
    // 打开更多操作,获取文章的id
    openMoreActive (articleId) {
      this.showMoreActive = true
      this.articleId = articleId
    },
    // 记住当前滚动的位置
    remmber (e) {
      this.activeChannel.scrollTop = e.target.scrollTop
    },
    // 当前激活的标签改变时触发
    changeChannel () {
      // 当前文章没有数据加载一次
      if (!this.activeChannel.articles.length) {
        // 加载效果显示
        this.activeChannel.upLoading = true
        this.activeChannel.finished = false
        // 加载一次数据
        this.onLoad()
      } else {
        // TODO,有数据会被tap组件默认行为覆盖，所以告他
        this.$nextTick(() => {
          const dom = this.$refs['scroll-wrapper'][this.channelIndex]
          dom.scrollTop = this.activeChannel.scrollTop
        })
      }
    },
    // 获取频道
    // async getMyChannels () {
    //   await getMyChannels()
    // },
    // 频道列表应该包含文章列表，每一个频道列表中都应该包含upLoading,finished,downLoading,articles: [],和时间戳
    async getChannels () {
      const data = await getChannels()
      // 给频道列表增加属性
      // console.log(data)
      this.myChannel = data.channels.map(item => {
        return {
          id: item.id,
          name: item.name,
          articles: [],
          upLoading: false,
          downLoading: false,
          finished: false,
          timestamp: Date.now(),
          scrollTop: ''
        }
      })
      // this.myChannel = data.channels
    },
    // 上拉加载
    async onLoad () {
      // // 模拟数据
      // window.setTimeout(() => {
      //   const data = []
      //   for (let i = this.articles.length; i < this.articles.length + 10; i++) {
      //     data.push(i + 1)
      //   }
      //   this.articles.push(...data)
      //   // 结束加载效果
      //   this.upLoading = false
      //   if (this.articles.length >= 40) {
      //     // 加载完了
      //     this.finished = true
      //   }
      // }, 2000)
      // 真实数据
      // 传入参数文章id和时间戳
      if (!this.activeChannel) return false
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      this.activeChannel.articles.push(...data.results)
      this.activeChannel.upLoading = false
      // 判断是否有数据
      if (data.pre_timestamp) {
        this.activeChannel.timestamp = data.pre_timestamp
      } else {
        this.activeChannel.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      // 模拟数据
      // window.setTimeout(() => {
      //   const data = [1, 2, 3, 4, 5, 6]
      //   if (data.length) {
      //     // 覆盖页面
      //     this.articles = data
      //     // 结束刷新
      //     this.downLoading = false
      //     // 提示文案
      //     this.successText = '刷新成功'
      //     // 如还有数据
      //     this.finished = false
      //     // 防止数据不满一屏
      //     this.onLoad()
      //   } else {
      //     this.downLoading = false
      //     this.successText = '没有数据啦'
      //   }
      // }, 2000)
      // 真实数据
      // 传入参数文章id和时间戳
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      if (data.results.length) {
        this.activeChannel.articles = data.results
        this.activeChannel.downLoading = false
        this.successText = '刷新成功'
        this.activeChannel.timestamp = data.pre_timestamp
        this.activeChannel.finished = false
        this.onLoad()
      } else {
        this.activeChannel.downLoading = false
        this.successText = '没有数据啦'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
// 图片样式
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
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
