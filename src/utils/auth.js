// 导出三个操作
const USER_KEY = 'mobile-pro-cqf'
// 获取用户信息
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
}
// 设置用户信息 user是对象
export const setUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}
// 删除用户信息
export const delUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
