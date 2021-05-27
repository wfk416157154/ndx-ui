import request from '@/utils/request'

// 查询接收相关信息列表
export function listReceiveInfo(query) {
  return request({
    url: '/basic/receiveInfo/list',
    method: 'get',
    params: query
  })
}

// 查询接收相关信息详细
export function getReceiveInfo(id) {
  return request({
    url: '/basic/receiveInfo/' + id,
    method: 'get'
  })
}

// 新增接收相关信息
export function addReceiveInfo(data) {
  return request({
    url: '/basic/receiveInfo',
    method: 'post',
    data: data
  })
}

// 修改接收相关信息
export function updateReceiveInfo(data) {
  return request({
    url: '/basic/receiveInfo',
    method: 'put',
    data: data
  })
}

// 删除接收相关信息
export function delReceiveInfo(id) {
  return request({
    url: '/basic/receiveInfo/' + id,
    method: 'delete'
  })
}
