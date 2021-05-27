import request from '@/utils/request'

// 查询老师考勤列表
export function listTeacherAttendance(query) {
  return request({
    url: '/basic/teacherAttendance/list',
    method: 'get',
    params: query
  })
}

// 查询老师考勤详细
export function getTeacherAttendance(id) {
  return request({
    url: '/basic/teacherAttendance/' + id,
    method: 'get'
  })
}

// 新增老师考勤
export function addTeacherAttendance(data) {
  return request({
    url: '/basic/teacherAttendance',
    method: 'post',
    data: data
  })
}

// 修改老师考勤
export function updateTeacherAttendance(data) {
  return request({
    url: '/basic/teacherAttendance',
    method: 'put',
    data: data
  })
}

// 删除老师考勤
export function delTeacherAttendance(id) {
  return request({
    url: '/basic/teacherAttendance/' + id,
    method: 'delete'
  })
}
