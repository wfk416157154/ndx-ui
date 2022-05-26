import request from '@/utils/request'

// 查询消息接收人列表
export function listWxMsgUser(query) {
  return request({
    url: '/msgUser/list',
    method: 'get',
    params: query
  })
}
// 获取消息接收人的详细信息
export function getWxMsgUser(id) {
  return request({
    url: '/msgUser/' + id,
    method: 'get'
  })
}

// 新增消息接收人
export function addWxMsgUser(data) {
  return request({
    url: '/wxMaterial',
    method: 'post',
    data: data
  })
}


// 修改消息接收人
export function updateWxMsgUser(data) {
  return request({
    url: '/msgUser',
    method: 'put',
    data: data
  })
}

// 删除消息接收人
export function delWxMsgUser(id) {
  return request({
    url: '/msgUser/' + id,
    method: 'delete'
  })
}
