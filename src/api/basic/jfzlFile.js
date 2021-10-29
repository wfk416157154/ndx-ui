import request from '@/utils/request'

// 查询教辅资料列表
export function listJfzlFile(query) {
  return request({
    url: '/basic/jfzlFile/list',
    method: 'get',
    params: query
  })
}

// 查询教辅资料详细
export function getJfzlFile(id) {
  return request({
    url: '/basic/jfzlFile/' + id,
    method: 'get'
  })
}

// 新增教辅资料
export function addJfzlFile(data) {
  return request({
    url: '/basic/jfzlFile',
    method: 'post',
    data: data
  })
}

// 修改教辅资料
export function updateJfzlFile(data) {
  return request({
    url: '/basic/jfzlFile',
    method: 'put',
    data: data
  })
}

// 删除教辅资料
export function delJfzlFile(id) {
  return request({
    url: '/basic/jfzlFile/' + id,
    method: 'delete'
  })
}
