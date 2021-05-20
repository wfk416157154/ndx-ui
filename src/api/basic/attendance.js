import request from '@/utils/request'

// 查询学生考勤列表
export function listAttendance(query) {
  return request({
    url: '/basic/attendance/list',
    method: 'get',
    params: query
  })
}

// 查询学生考勤详细
export function getAttendance(id) {
  return request({
    url: '/basic/attendance/' + id,
    method: 'get'
  })
}

// 新增学生考勤
export function addAttendance(data) {
  return request({
    url: '/basic/attendance',
    method: 'post',
    data: data
  })
}

// 修改学生考勤
export function updateAttendance(data) {
  return request({
    url: '/basic/attendance',
    method: 'put',
    data: data
  })
}

// 删除学生考勤
export function delAttendance(id) {
  return request({
    url: '/basic/attendance/' + id,
    method: 'delete'
  })
}
