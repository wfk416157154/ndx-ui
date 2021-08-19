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

// 查询日志状态(1:未填写,2:已填写未发送,3:已发送)
export function workLogStatusQuery(query) {
  return request({
    url: '/basic/basicTeacherWorkLog/workLogStatusQuery',
    method: 'get',
    params: query
  })
}

// 目前启用查询日志
export function workLogTemplateQuery(query) {
  return request({
    url: 'basic/basicTeacherWorkLog/workLogTemplateQuery',
    method: 'get',
    params: query
  })
}

// 查看老师日志主页面
export function homePageQuery(query) {
  return request({
    url: '/basic/basicTeacherWorkLog/homePageQuery',
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

// 教务端老师工作日志详情查看
export function workLogQueryForEducational(id) {
  return request({
    url: '/basic/basicTeacherWorkLog/workLogQueryForEducational/' + id,
    method: 'get'
  })
}

// 保存老师工作日志
export function addSave(data) {
  return request({
    url: '/basic/basicTeacherWorkLog/save',
    method: 'post',
    data: data
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
