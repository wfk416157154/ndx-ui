import request from '@/utils/request'

// 查询文章主题列表
export function listArticle(query) {
  return request({
    url: '/demo/article/list',
    method: 'get',
    params: query
  })
}

// 查询文章主题详细
export function getArticle(id) {
  return request({
    url: '/demo/article/' + id,
    method: 'get'
  })
}

// 新增文章主题
export function addArticle(data) {
  return request({
    url: '/demo/article',
    method: 'post',
    data: data
  })
}

// 修改文章主题
export function updateArticle(data) {
  return request({
    url: '/demo/article',
    method: 'put',
    data: data
  })
}

// 删除文章主题
export function delArticle(id) {
  return request({
    url: '/demo/article/' + id,
    method: 'delete'
  })
}
