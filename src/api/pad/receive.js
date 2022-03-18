import request from '@/utils/request'

// 查询广告确认列表
export function listReceive(query) {
  return request({
    url: '/pad/receive/list',
    method: 'get',
    params: query
  })
}

// 查询广告确认详细
export function getReceive(id) {
  return request({
    url: '/pad/receive/' + id,
    method: 'get'
  })
}

// 新增广告确认
export function addReceive(data) {
  return request({
    url: '/pad/receive',
    method: 'post',
    data: data
  })
}

// 修改广告确认
export function updateReceive(data) {
  return request({
    url: '/pad/receive',
    method: 'put',
    data: data
  })
}

// 删除广告确认
export function delReceive(id) {
  return request({
    url: '/pad/receive/' + id,
    method: 'delete'
  })
}
