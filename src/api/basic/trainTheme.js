import request from '@/utils/request'

// 查询培训主题列表
export function listTrainTheme(query) {
  return request({
    url: '/basic/trainTheme/list',
    method: 'get',
    params: query
  })
}

// 查询培训主题详细
export function getTrainTheme(id) {
  return request({
    url: '/basic/trainTheme/' + id,
    method: 'get'
  })
}

// 新增培训主题
export function addTrainTheme(data) {
  return request({
    url: '/basic/trainTheme',
    method: 'post',
    data: data
  })
}

// 修改培训主题
export function updateTrainTheme(data) {
  return request({
    url: '/basic/trainTheme',
    method: 'put',
    data: data
  })
}

// 删除培训主题
export function delTrainTheme(id) {
  return request({
    url: '/basic/trainTheme/' + id,
    method: 'delete'
  })
}
