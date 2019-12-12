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

/**
 *举报举报
 * @param {*} articleId
 * @param {*} type
 */
export const reports = (articleId, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: articleId,
    type
  })
}
/**
 *联想建议
 * @param {*} q
 */
export const suggestion = (q) => {
  return request('/app/v1_0/suggestion', 'get', { q })
}
/**
 *搜索结果文章
 * @param {*} page
 * @param {*} perpage
 * @param {*} q
 */
export const resoult = ({ page = 1, perpage = 10, q }) => {
  return request('/app/v1_0/search', 'get', {
    page,
    per_page: perpage,
    q
  })
}
/**
 *获取文章详情
 * @param {*} articleId
 */
export const details = (articleId) => {
  return request(`/app/v1_0/articles/${articleId}`, 'get')
}
