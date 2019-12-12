//  引入工具
import request from '@/utils/request'
/**
 * 获取用户的信息
 */
export const users = () => {
  return request('/app/v1_0/user', 'get')
}
