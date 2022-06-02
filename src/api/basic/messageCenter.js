import request from '@/utils/request'

// 获取微信基本消息表的详细信息
export function listWxMessage(path, query) {
  return request({
    url: path + 'wxMessage/list',
    method: 'get',
    params: query
  })
}

// 查询消息管理详细
export function getWxMessage(path, id) {
  return request({
    url: path + 'wxMessage/' + id,
    method: 'get'
  })
}

// 新增微信基本消息表
export function addWxMessage(path, data) {
  return request({
    url: path + 'wxMessage',
    method: 'post',
    data: data
  })
}


// 修改微信基本消息表
export function updateWxMessage(path, data) {
  return request({
    url: path + 'wxMessage',
    method: 'put',
    data: data
  })
}

// 删除微信基本消息表
export function delWxMessage(path, id) {
  return request({
    url: path + 'wxMessage/' + id,
    method: 'delete'
  })
}
