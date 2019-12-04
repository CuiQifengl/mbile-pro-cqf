//  引入工具
import request from '@/utils/request'
/**
 *文章列表
 * @param {*} channelId
 * @param {*} timestamp
 */
export const getArticles = (channelId, timestamp) => {
  return request('/app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}
/**
 *不喜欢文章
 * @param {*} articleId
 */
export const disLike = (articleId) => {
  return request('/app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
}
