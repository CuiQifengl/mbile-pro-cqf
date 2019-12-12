import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/Index')
const Question = () => import('@/views/question/Index')
const Video = () => import('@/views/video/Index')
const User = () => import('@/views/user/Index')
const UserProfile = () => import('@/views/user/Profile')
const UserChat = () => import('@/views/user/Chat')
const Login = () => import('@/views/user/Login')
const Search = () => import('@/views/search/Index')
const SearchResult = () => import('@/views/search/Result')
const Article = () => import('@/views/home/Article')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      // 首页
      { path: '/', name: 'home', component: Home, meta: { iskeepAlive: true } },
      // 问答
      { path: '/question', name: 'question', component: Question },
      // 视频
      { path: '/video', name: 'video', component: Video },
      // 我的
      { path: '/user', name: 'user', component: User }
    ]
  },
  // 编辑资料
  { path: '/user/profile', name: 'user-profile', component: UserProfile },
  // 小智同学
  { path: '/user/chat', name: 'user-chat', component: UserChat },
  // 登陆
  { path: '/login', name: 'login', component: Login },
  // 搜索中心
  { path: '/search', name: 'search', component: Search },
  // 搜索结果
  { path: '/search/result', name: 'search-result', component: SearchResult },
  // 文章详情
  { path: '/article/:id', name: 'article', component: Article, meta: { iskeepAlive: true } }
]

const router = new VueRouter({
  routes
})

// 设置路由守卫来判断该页面是否需要登陆并回跳
router.beforeEach((to, from, next) => {
  const { user } = store.state
  const loginconfig = { path: '/login', query: { redirectUrl: to.path } }
  if (to.path.startsWith('/user') && !user.token) return next(loginconfig)
  next()
})
export default router
