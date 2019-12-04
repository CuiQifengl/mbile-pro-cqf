// 引入工具
import request from '@/utils/request'
// 登陆
export const login = (loginForm) => {
  return request('/app/v1_0/authorizations', 'post', loginForm)
}
