import request from '@/utils/request'

// 新增微信素材表
export function listWxMaterial(path, query) {
  return request({
    url: path + 'wxMaterial/list',
    method: 'get',
    params: query
  })
}
// 获取微信素材表的详细信息
export function getWxMaterial(path, id) {
  return request({
    url: path + 'wxMaterial/' + id,
    method: 'get'
  })
}

// 新增微信基本消息表
export function addWxMaterial(path, data) {
  return request({
    url: path + 'wxMaterial',
    method: 'post',
    data: data
  })
}


// 修改微信素材表
export function updateWxMaterial(path, data) {
  return request({
    url: path + 'wxMaterial',
    method: 'put',
    data: data
  })
}

// 删除微信素材表
export function delWxMaterial(path, data) {
  return request({
    url: path + 'wxMaterial/delWxMaterial',
    method: 'post',
    data: data
  })
}
