import request from '@/utils/request'

// 查询课件管理列表
export function listCourseware(query) {
  return request({
    url: '/basic/courseware/list',
    method: 'get',
    params: query
  })
}

// 查询课件管理详细
export function getCourseware(id) {
  return request({
    url: '/basic/courseware/' + id,
    method: 'get'
  })
}

// 新增课件管理
export function addCourseware(data) {
  return request({
    url: '/basic/courseware',
    method: 'post',
    data: data
  })
}

// 修改课件管理
export function updateCourseware(data) {
  return request({
    url: '/basic/courseware',
    method: 'put',
    data: data
  })
}

// 删除课件管理
export function delCourseware(id) {
  return request({
    url: '/basic/courseware/' + id,
    method: 'delete'
  })
}
