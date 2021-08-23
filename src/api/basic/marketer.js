import request from '@/utils/request'

// 查询市场人员列表
export function listMarketer(query) {
  return request({
    url: '/basic/marketer/list',
    method: 'get',
    params: query
  })
}

// 查询市场人员详细
export function getMarketer(id) {
  return request({
    url: '/basic/marketer/' + id,
    method: 'get'
  })
}

// 新增市场人员
export function addMarketer(data) {
  return request({
    url: '/basic/marketer',
    method: 'post',
    data: data
  })
}

// 修改市场人员
export function updateMarketer(data) {
  return request({
    url: '/basic/marketer',
    method: 'put',
    data: data
  })
}

// 删除市场人员
export function delMarketer(id) {
  return request({
    url: '/basic/marketer/' + id,
    method: 'delete'
  })
}
