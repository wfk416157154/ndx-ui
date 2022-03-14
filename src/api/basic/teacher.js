import request from '@/utils/request'

// 查询老师信息列表
export function listTeacher(query) {
  return request({
    url: '/basic/teacher/list',
    method: 'get',
    params: query
  })
}

// 查询老师信息主页面列表
export function listHomepage(query) {
  return request({
    url: '/basic/teacher/listHomepage',
    method: 'get',
    params: query
  })
}

// 查询班级基础信息列表(页面查询调用)
export function getPageList(query) {
  return request({
    url: '/basic/bjclass/pageList',
    method: 'get',
    params: query
  })
}

// 查询消息管理列表
export function getMessageList(query) {
  return request({
    url: '/basic/message/list',
    method: 'get',
    params: query
  })
}

// 查询老师信息详细
export function getTeacher(id) {
  return request({
    url: '/basic/teacher/' + id,
    method: 'get'
  })
}

// 首页班级教学计划进度
export function homePageClassTeachingPlan(id) {
  return request({
    url: '/basic/planProgress/homePageClassTeachingPlan/' + id,
    method: 'get'
  })
}

// 获取老师详情页面
export function getTeacherDetail(id) {
  return request({
    url: '/basic/teacher/getTeacherDetail/' + id,
    method: 'get'
  })
}
// 新增老师信息
export function addTeacher(data) {
  return request({
    url: '/basic/teacher',
    method: 'post',
    data: data
  })
}

// 修改老师信息
export function updateTeacher(data) {
  return request({
    url: '/basic/teacher',
    method: 'put',
    data: data
  })
}

// 删除老师信息
export function delTeacher(id) {
  return request({
    url: '/basic/teacher/' + id,
    method: 'delete'
  })


}
