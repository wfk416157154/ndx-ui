import request from '@/utils/request'

// 查询校区基础信息列表
export function listSchool(query) {
  return request({
    url: '/basic/school/list',
    method: 'get',
    params: query
  })
}

// 查询校区基础信息详细
export function getSchool(id) {
  return request({
    url: '/basic/school/' + id,
    method: 'get'
  })
}

// 新增校区基础信息
export function addSchool(data) {
  return request({
    url: '/basic/school',
    method: 'post',
    data: data
  })
}

// 修改校区基础信息
export function updateSchool(data) {
  return request({
    url: '/basic/school',
    method: 'put',
    data: data
  })
}

// 删除校区基础信息
export function delSchool(id) {
  return request({
    url: '/basic/school/' + id,
    method: 'delete'
  })
}
