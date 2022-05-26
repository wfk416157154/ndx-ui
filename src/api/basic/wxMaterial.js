import request from '@/utils/request'

// 新增微信素材表
export function listWxMaterial(query) {
  return request({
    url: '/wxMaterial/list',
    method: 'get',
    params: query
  })
}
// 获取微信素材表的详细信息
export function getWxMaterial(id) {
  return request({
    url: '/wxMaterial/' + id,
    method: 'get'
  })
}

// 新增微信基本消息表
export function addWxMaterial(data) {
  return request({
    url: '/wxMaterial',
    method: 'post',
    data: data
  })
}


// 修改微信素材表
export function updateWxMaterial(data) {
  return request({
    url: '/wxMaterial',
    method: 'put',
    data: data
  })
}

// 删除微信素材表
export function delWxMaterial(id) {
  return request({
    url: '/wxMaterial/' + id,
    method: 'delete'
  })
}
