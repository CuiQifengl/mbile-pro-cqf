// 挂在一些工具，过滤器，自定义插件等
// 定义一个VUE插件的固定写法
// 导出一个对象，必须有一个属性install，指向一个函数，函数会有默认传参Vue构造函数

// 引入一个相对时间的插件
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)

// 过滤器函数
// value代表之前的时间
const relativeTim = (value) => {
  return dayjs().locale('zh-cn').from(value)
}

export default {
  install (Vue) {
    Vue.filter('relativeTime', relativeTim)
  }
}
