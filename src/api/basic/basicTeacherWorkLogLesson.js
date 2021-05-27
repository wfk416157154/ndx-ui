import request from '@/utils/request'

// 查询教师工作日志课中列表
export function listBasicTeacherWorkLogLesson(query) {
  return request({
    url: '/basic/basicTeacherWorkLogLesson/list',
    method: 'get',
    params: query
  })
}

// 查询教师工作日志课中详细
export function getBasicTeacherWorkLogLesson(id) {
  return request({
    url: '/basic/basicTeacherWorkLogLesson/' + id,
    method: 'get'
  })
}

// 新增教师工作日志课中
export function addBasicTeacherWorkLogLesson(data) {
  return request({
    url: '/basic/basicTeacherWorkLogLesson',
    method: 'post',
    data: data
  })
}

// 修改教师工作日志课中
export function updateBasicTeacherWorkLogLesson(data) {
  return request({
    url: '/basic/basicTeacherWorkLogLesson',
    method: 'put',
    data: data
  })
}

// 删除教师工作日志课中
export function delBasicTeacherWorkLogLesson(id) {
  return request({
    url: '/basic/basicTeacherWorkLogLesson/' + id,
    method: 'delete'
  })
}
