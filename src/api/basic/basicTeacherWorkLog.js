import request from '@/utils/request'

// 查询老师所在的班级信息及课表课程信息
export function workLogListQuery(query) {
  return request({
    url: '/basic/basicTeacherWorkLog/workLogListQuery',
    method: 'get',
    params: query
  })
}

// 查询老师工作日志列表
export function listBasicTeacherWorkLog(query) {
  return request({
    url: '/basic/basicTeacherWorkLog/list',
    method: 'get',
    params: query
  })
}

// 查询老师工作日志详细
export function getBasicTeacherWorkLog(id) {
  return request({
    url: '/basic/basicTeacherWorkLog/' + id,
    method: 'get'
  })
}

// 新增老师工作日志
export function addBasicTeacherWorkLog(data) {
  return request({
    url: '/basic/basicTeacherWorkLog',
    method: 'post',
    data: data
  })
}

// 修改老师工作日志
export function updateBasicTeacherWorkLog(data) {
  return request({
    url: '/basic/basicTeacherWorkLog',
    method: 'put',
    data: data
  })
}

// 删除老师工作日志
export function delBasicTeacherWorkLog(id) {
  return request({
    url: '/basic/basicTeacherWorkLog/' + id,
    method: 'delete'
  })
}
