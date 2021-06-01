import request from '@/utils/request'

// 查询老师人事列表
export function listTeacherPersonnel(query) {
  return request({
    url: '/basic/teacherPersonnel/list',
    method: 'get',
    params: query
  })
}

// 查询老师人事详细
export function getTeacherPersonnel(id) {
  return request({
    url: '/basic/teacherPersonnel/' + id,
    method: 'get'
  })
}

// 新增老师人事
export function addTeacherPersonnel(data) {
  return request({
    url: '/basic/teacherPersonnel',
    method: 'post',
    data: data
  })
}

// 修改老师人事
export function updateTeacherPersonnel(data) {
  return request({
    url: '/basic/teacherPersonnel',
    method: 'put',
    data: data
  })
}

// 删除老师人事
export function delTeacherPersonnel(id) {
  return request({
    url: '/basic/teacherPersonnel/' + id,
    method: 'delete'
  })
}
