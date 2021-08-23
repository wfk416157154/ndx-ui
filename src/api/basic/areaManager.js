import request from '@/utils/request'

// 查询区域负责人列表
export function listAreaManager(query) {
  return request({
    url: '/basic/areaManager/list',
    method: 'get',
    params: query
  })
}

// 查询区域负责人详细
export function getAreaManager(id) {
  return request({
    url: '/basic/areaManager/' + id,
    method: 'get'
  })
}

// 新增区域负责人
export function addAreaManager(data) {
  return request({
    url: '/basic/areaManager',
    method: 'post',
    data: data
  })
}

// 修改区域负责人
export function updateAreaManager(data) {
  return request({
    url: '/basic/areaManager',
    method: 'put',
    data: data
  })
}

// 删除区域负责人
export function delAreaManager(id) {
  return request({
    url: '/basic/areaManager/' + id,
    method: 'delete'
  })
}
