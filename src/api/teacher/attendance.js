import request from '@/utils/request'

// 查询老师考勤列表
export function listAttendance(query) {
  return request({
    url: '/teacher/teacherAttendance/list',
    method: 'get',
    params: query
  })
}

// 查询老师考勤详细
export function getAttendance(id) {
  return request({
    url: '/teacher/teacherAttendance/' + id,
    method: 'get'
  })
}

// 新增老师考勤
export function addAttendance(data) {
  return request({
    url: '/teacher/teacherAttendance',
    method: 'post',
    data: data
  })
}

// 修改老师考勤
export function updateAttendance(data) {
  return request({
    url: '/teacher/teacherAttendance',
    method: 'put',
    data: data
  })
}

// 删除老师考勤
export function delAttendance(id) {
  return request({
    url: '/teacher/teacherAttendance/' + id,
    method: 'delete'
  })
}
