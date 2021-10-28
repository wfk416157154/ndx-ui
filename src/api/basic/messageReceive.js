import request from '@/utils/request'

// 查询消息接收人-确认表列表
export function listMessageReceive(query) {
  return request({
    url: '/basic/messageReceive/list',
    method: 'get',
    params: query
  })
}

// 查询消息接收人-确认表详细
export function getMessageReceive(id) {
  return request({
    url: '/basic/messageReceive/' + id,
    method: 'get'
  })
}

// 新增消息接收人-确认表
export function addMessageReceive(data) {
  return request({
    url: '/basic/messageReceive',
    method: 'post',
    data: data
  })
}

// 修改消息接收人-确认表
export function updateMessageReceive(data) {
  return request({
    url: '/basic/messageReceive',
    method: 'put',
    data: data
  })
}

// 删除消息接收人-确认表
export function delMessageReceive(id) {
  return request({
    url: '/basic/messageReceive/' + id,
    method: 'delete'
  })
}
