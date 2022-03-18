import request from '@/utils/request'

// 查询广告列表
export function listAdvertisement(query) {
  return request({
    url: '/pad/advertisement/list',
    method: 'get',
    params: query
  })
}

// 查询广告详细
export function getAdvertisement(id) {
  return request({
    url: '/pad/advertisement/' + id,
    method: 'get'
  })
}

// 新增广告
export function addAdvertisement(data) {
  return request({
    url: '/pad/advertisement',
    method: 'post',
    data: data
  })
}

// 修改广告
export function updateAdvertisement(data) {
  return request({
    url: '/pad/advertisement',
    method: 'put',
    data: data
  })
}

// 删除广告
export function delAdvertisement(id) {
  return request({
    url: '/pad/advertisement/' + id,
    method: 'delete'
  })
}
