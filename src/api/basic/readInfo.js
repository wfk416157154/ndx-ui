import request from '@/utils/request'

// 查询已读相关信息列表
export function listReadInfo(query) {
  return request({
    url: '/basic/readInfo/list',
    method: 'get',
    params: query
  })
}

// 查询已读相关信息详细
export function getReadInfo(id) {
  return request({
    url: '/basic/readInfo/' + id,
    method: 'get'
  })
}

// 新增已读相关信息
export function addReadInfo(data) {
  return request({
    url: '/basic/readInfo',
    method: 'post',
    data: data
  })
}

// 修改已读相关信息
export function updateReadInfo(data) {
  return request({
    url: '/basic/readInfo',
    method: 'put',
    data: data
  })
}

// 删除已读相关信息
export function delReadInfo(id) {
  return request({
    url: '/basic/readInfo/' + id,
    method: 'delete'
  })
}
