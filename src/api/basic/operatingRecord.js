import request from '@/utils/request'

// 查询公共的操作记录列表
export function listOperatingRecord(query) {
  return request({
    url: '/basic/operatingRecord/list',
    method: 'get',
    params: query
  })
}

// 查询公共的操作记录详细
export function getOperatingRecord(id) {
  return request({
    url: '/basic/operatingRecord/' + id,
    method: 'get'
  })
}

// 新增公共的操作记录
export function addOperatingRecord(data) {
  return request({
    url: '/basic/operatingRecord',
    method: 'post',
    data: data
  })
}

// 修改公共的操作记录
export function updateOperatingRecord(data) {
  return request({
    url: '/basic/operatingRecord',
    method: 'put',
    data: data
  })
}

// 删除公共的操作记录
export function delOperatingRecord(id) {
  return request({
    url: '/basic/operatingRecord/' + id,
    method: 'delete'
  })
}
