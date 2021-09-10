import request from '@/utils/request'

// 查询老师考勤列表
export function listTeacherAttendance(query) {
  return request({
    url: '/basic/teacherAttendance/list',
    method: 'get',
    params: query
  })
}

// 查询某个班级在某个时间范围内的课堂签到情况列表
export function queryClassQiandaoList(query) {
  return request({
    url: '/basic/stuQiandao/queryClassQiandaoList',
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

// 列名查询-单个老师考勤统计
export function teacherAttendanceStatistics(query) {
  return request({
    url: '/basic/teacherAttendanceStatistics/columnNamelist',
    method: 'get',
    params: query
  })
}

// 列名查询-单个老师考勤统计
export function teacherAttendanceStatisticsList(query) {
  return request({
    url: '/basic/teacherAttendanceStatistics/list',
    method: 'get',
    params: query
  })
}

// 列名查询-单个老师考勤统计
export function jwColumnNamelist(query) {
  return request({
    url: '/basic/teacherAttendanceStatistics/jwColumnNamelist',
    method: 'get',
    params: query
  })
}

// 列名查询-单个老师考勤统计
export function jwTeaAttenDatalist(query) {
  return request({
    url: '/basic/teacherAttendanceStatistics/jwTeaAttenDatalist',
    method: 'get',
    params: query
  })
}