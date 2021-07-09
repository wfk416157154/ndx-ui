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

// 查询老师信息详细
export function getTeacher(id) {
  return request({
    url: '/basic/teacher/' + id,
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
