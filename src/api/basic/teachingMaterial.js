import request from '@/utils/request'

// 查询教材列表
export function listTeachingMaterial(query) {
  return request({
    url: '/basic/teachingMaterial/list',
    method: 'get',
    params: query
  })
}

// 查询教材详细
export function getTeachingMaterial(id) {
  return request({
    url: '/basic/teachingMaterial/' + id,
    method: 'get'
  })
}

// 新增教材
export function addTeachingMaterial(data) {
  return request({
    url: '/basic/teachingMaterial',
    method: 'post',
    data: data
  })
}

// 修改教材
export function updateTeachingMaterial(data) {
  return request({
    url: '/basic/teachingMaterial',
    method: 'put',
    data: data
  })
}

// 删除教材
export function delTeachingMaterial(id) {
  return request({
    url: '/basic/teachingMaterial/' + id,
    method: 'delete'
  })
}
