// 封装的目的：复用，导出一个调用请求的函数。
// - 处理JS最大安全数值
// - 处理在请求头中携带token
// - 处理响应数据（剥离无效数据）
// - 导出一个使用配置好的axios发请求的函数

// 引入axios
import axios from 'axios'
// 引入处理大数字
import JSONBIGINT from 'json-bigint'
// 引入vuex实例
import store from '@/store'
// 引入路由组件
import router from 'vue-router'
// 创建一个axios
const instance = axios.create({
  // 基准地址
  baseURL: 'http://ttapi.research.itcast.cn',
  //  处理大数字数据
  transformResponse: [function (data) {
    try {
      return JSONBIGINT.parse(data)
    } catch (error) {
      return data
    }
  }]
})

// 在请求头中携带token,在请求拦截器中做
instance.interceptors.request.use(function (config) {
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }

  console.log(config)
  return config
}, function (error) {
  return Promise.reject(error)
})

// 剥离无效的数据，在响应拦截器中做
instance.interceptors.response.use(function (res) {
  try {
    return res.data.data
  } catch (error) {
    return res
  }
}, async function (error) {
  try {
    // 刷新token
  //  1 判断状态是否报错，状态码是不是401
    if (error.response && error.response.status === 401) {
    // 2 判断是否登陆
      const { user } = store.state
      if (!user.token && !user.refresh_token) {
      // 没有登陆跳转到登陆页面
        router.push('/login')
        // 阻止程序的运行
        return Promise.reject(error)
      }
      // 3 登陆成功，token失效,刷新token,向后台发送请求
      const res = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 4更新token:在vuex组件中
      store.commit('setUser', {
        token: res.data.data,
        refresh_token: user.refresh_token
      })
      // 5 refresh_token没失效，刷新成功,继续失败的请求
      return instance(error.config)
    }// 6 refresh_token失效，刷新失败,返回登陆
  } catch (error) {
    //   登陆以后跳转到原来页面
    const loginurl = { path: '/login', query: { redirectUrl: router.currentRoute.path } }
    router.push(loginurl)
  }
  return Promise.reject(error)
})

// - 导出一个使用配置好的axios发请求的函数
export default (url, method, data) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
