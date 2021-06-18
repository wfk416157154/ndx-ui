import request from '@/utils/request'

// 查询教材类型列表
export function listType(query) {
  return request({
    url: '/basic/type/list',
    method: 'get',
    params: query
  })
}

// 查询教材类型详细
export function getType(id) {
  return request({
    url: '/basic/type/' + id,
    method: 'get'
  })
}

// 新增教材类型
export function addType(data) {
  return request({
    url: '/basic/type',
    method: 'post',
    data: data
  })
}

// 修改教材类型
export function updateType(data) {
  return request({
    url: '/basic/type',
    method: 'put',
    data: data
  })
}

// 删除教材类型
export function delType(id) {
  return request({
    url: '/basic/type/' + id,
    method: 'delete'
  })
}
