import request from '@/utils/request'

// 查询消息管理列表
export function listMessage(query) {
  return request({
    url: '/basic/message/list',
    method: 'get',
    params: query
  })
}

// 查询消息管理详细
export function getMessage(id) {
  return request({
    url: '/basic/message/' + id,
    method: 'get'
  })
}

// 新增消息管理
export function addMessage(data) {
  return request({
    url: '/basic/message',
    method: 'post',
    data: data
  })
}

// 修改消息管理
export function updateMessage(data) {
  return request({
    url: '/basic/message',
    method: 'put',
    data: data
  })
}

// 删除消息管理
export function delMessage(id) {
  return request({
    url: '/basic/message/' + id,
    method: 'delete'
  })
}
