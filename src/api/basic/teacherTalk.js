import request from '@/utils/request'

// 查询老师学生谈话列表
export function listTeacherTalk(query) {
  return request({
    url: '/basic/teacherTalk/list',
    method: 'get',
    params: query
  })
}

// 查询老师学生谈话详细
export function getTeacherTalk(id) {
  return request({
    url: '/basic/teacherTalk/' + id,
    method: 'get'
  })
}

// 新增老师学生谈话
export function addTeacherTalk(data) {
  return request({
    url: '/basic/teacherTalk',
    method: 'post',
    data: data
  })
}

// 修改老师学生谈话
export function updateTeacherTalk(data) {
  return request({
    url: '/basic/teacherTalk',
    method: 'put',
    data: data
  })
}

// 删除老师学生谈话
export function delTeacherTalk(id) {
  return request({
    url: '/basic/teacherTalk/' + id,
    method: 'delete'
  })
}
