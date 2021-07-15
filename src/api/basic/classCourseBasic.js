import request from '@/utils/request'

// 查询班级课程基本列表
export function listClassCourseBasic(query) {
  return request({
    url: '/basic/classCourseBasic/list',
    method: 'get',
    params: query
  })
}

// 查询班级课程基本详细
export function getClassCourseBasic(id) {
  return request({
    url: '/basic/classCourseBasic/' + id,
    method: 'get'
  })
}

// 新增班级课程基本
export function addClassCourseBasic(data) {
  return request({
    url: '/basic/classCourseBasic',
    method: 'post',
    data: data
  })
}

// 修改班级课程基本
export function updateClassCourseBasic(data) {
  return request({
    url: '/basic/classCourseBasic',
    method: 'put',
    data: data
  })
}

// 删除班级课程基本
export function delClassCourseBasic(id) {
  return request({
    url: '/basic/classCourseBasic/' + id,
    method: 'delete'
  })
}
