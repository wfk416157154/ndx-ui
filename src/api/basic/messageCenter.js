import request from '@/utils/request'

// 获取微信基本消息表的详细信息
export function listWxMessage(query) {
  return request({
    url: '/wxMessage/list',
    method: 'get',
    params: query
  })
}

// 查询消息管理详细
export function getWxMessage(id) {
  return request({
    url: '/wxMessage/' + id,
    method: 'get'
  })
}

// 新增微信基本消息表
export function addWxMessage(data) {
  return request({
    url: '/wxMessage',
    method: 'post',
    data: data
  })
}


// 修改微信基本消息表
export function updateWxMessage(data) {
  return request({
    url: '/wxMessage',
    method: 'put',
    data: data
  })
}

// 删除微信基本消息表
export function delWxMessage(id) {
  return request({
    url: '//wxMessage/' + id,
    method: 'delete'
  })
}
