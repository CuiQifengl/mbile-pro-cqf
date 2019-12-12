<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="lis">
      <div
        class="chat-item"
        :class="{left:item.name==='xz',right:item.name==='self'}"
        v-for="(item,i) in list"
        :key="i"
      >
        <van-image fit="cover" round :src="meinv" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image fit="cover" round :src="photo"  v-if="item.name==='self'"/>
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <span @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
// 将图片引进来
import meinv from '@/assets/meinv.jpg'
// 设置用户的头像
import { mapState } from 'vuex'
// 引入即时通讯
import io from 'socket.io-client'
export default {
  name: 'Chat',
  computed: {
    ...mapState(['photo', 'user'])
  },
  beforeDestroy () {
    // 关闭连接
    this.socket.close()
  },
  created () {
    // 创建链接
    this.socket = io('http://ttapi.research.itcast.cn', {
      quert: {
        token: this.user.token
      }
    })
    this.socket.on('connect', () => {
      // 建立链接，小智默认语录
      this.list.push({ name: 'xz', msg: '来了老弟' })
    })
    // 接收消息
    this.socket.on('message', data => {
      // 接受机器人消息
      this.list.push({ name: 'xz', msg: data.msg })
      this.scrollBottom()
    })
  },
  methods: {
    // 发消息
    send () {
      if (!this.value) return false
      this.socket.emit('message', { msg: this.value, timestamp: Date.now() })
      this.list.push({ name: 'self', msg: this.value })
      this.value = ''
      this.scrollBottom()
    },
    // 滚动到与对话相同的位置
    scrollBottom () {
      this.$nextTick(() => {
        this.$refs.lis.scrollTop = this.$refs.lis.scrollHeight
      })
    }
  },
  data () {
    return {
      value: '',
      meinv,
      // socket.io-client的实例
      socket: '',
      // 记录聊天信息
      list: []
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
