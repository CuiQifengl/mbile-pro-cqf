//  引入工具
import request from '@/utils/request'
// /**
//  *频道获取
//  */
export const getChannels = () => {
  return request('/app/v1_0/user/channels', 'get')
}
/**
 * 全部频道列表
 */
export const allChannels = () => {
  return request('/app/v1_0/channels', 'get')
}
