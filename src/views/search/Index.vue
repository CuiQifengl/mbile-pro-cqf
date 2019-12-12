<template>
  <div>
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search
      v-model.trim="q"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch(q)"
    >
      <div slot="action" @click="onSearch"></div>
    </van-search>
    <!-- 联想搜索 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell
        icon="search"
        v-for=" item in options"
        :key="item"
        @click="onSearch(item.replace(`<span>${q}</span>`,q))"
      >
        <p v-html="item"></p>
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for=" item in historyList" :key="item">
          <a class="word_btn" @click="tosr(item)">{{item}}</a>
          <van-icon class="close_btn" slot="right-icon" name="cross" @click="del(item)" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 约定key值，本地操作  渲染页面，删除，根据历史去搜索，清空
// 引入联想建议API
import { suggestion } from '@/api/articles'
const KEY = 'Mobile-cqf-history'
export default {
  name: 'search',
  data () {
    return {
      q: '',
      historyList: JSON.parse(window.localStorage.getItem(KEY) || '[]'),
      // 接收联想记忆
      options: [],
      // 定时器
      timer: null
    }
  },
  // 监听q的变化，来联想建议
  watch: {
    q () {
      if (!this.q) {
        window.clearTimeout(this.timer)
        return false
      }
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(async () => {
        const data = await suggestion(this.q)
        this.options = data.options.map(item =>
          item.toLowerCase().replace(this.q, `<span>${this.q}</span>`)
        )
      }, 500)
    }
  },
  methods: {
    // 确定搜索时触发
    onSearch (key) {
      // 没输入没办法跳转
      if (!key.trim()) return false
      // set方法里没有重复的元素
      const set = new Set(this.historyList)
      set.add(key)
      this.historyList = [...set]
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
      this.$router.push({ path: '/search/Result', query: { q: key } })
    },
    // 删除点击的历史记录
    del (key) {
      const index = this.historyList.findIndex(item => item === key)
      this.historyList.splice(index, 1)
      // 存到本地中
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },
    // 点击当前历史记录跳转搜索结果页面
    tosr (key) {
      this.$router.push({ path: '/search/Result', query: { q: key } })
    },
    // 清除所有的历史记录
    clear () {
      this.historyList = []
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    }
  }
}
</script>

<style lang="less" scoped>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
// 联想搜索样式
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
