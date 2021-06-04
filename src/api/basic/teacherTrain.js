import request from '@/utils/request'

// 查询老师培训列表
export function listTeacherTrain(query) {
  return request({
    url: '/basic/teacherTrain/list',
    method: 'get',
    params: query
  })
}

// 查询老师培训详细
export function getTeacherTrain(id) {
  return request({
    url: '/basic/teacherTrain/' + id,
    method: 'get'
  })
}

// 新增老师培训
export function addTeacherTrain(data) {
  return request({
    url: '/basic/teacherTrain',
    method: 'post',
    data: data
  })
}

// 修改老师培训
export function updateTeacherTrain(data) {
  return request({
    url: '/basic/teacherTrain',
    method: 'put',
    data: data
  })
}

// 删除老师培训
export function delTeacherTrain(id) {
  return request({
    url: '/basic/teacherTrain/' + id,
    method: 'delete'
  })
}
