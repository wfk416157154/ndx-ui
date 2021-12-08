import request from '@/utils/request'

// 查询老师培训过程列表
export function listTrainTeacherProcess(query) {
  return request({
    url: '/basic/trainTeacherProcess/list',
    method: 'get',
    params: query
  })
}

// 查询老师培训过程的笔记图片列表
export function notesListTrainTeacherProcess(query) {
  return request({
    url: '/basic/trainTeacherProcess/notesList',
    method: 'get',
    params: query
  })
}


// 查询老师培训过程详细
export function getTrainTeacherProcess(id) {
  return request({
    url: '/basic/trainTeacherProcess/' + id,
    method: 'get'
  })
}

// 新增老师培训过程
export function addTrainTeacherProcess(data) {
  return request({
    url: '/basic/trainTeacherProcess',
    method: 'post',
    data: data
  })
}

// 新增或修改老师培训过程
export function addOrUpdateTrainTeacherProcess(data) {
  return request({
    url: '/basic/trainTeacherProcess/addOrUpdate',
    method: 'post',
    data: data
  })
}

// 修改老师培训过程
export function updateTrainTeacherProcess(data) {
  return request({
    url: '/basic/trainTeacherProcess',
    method: 'put',
    data: data
  })
}

// 删除老师培训过程
export function delTrainTeacherProcess(id) {
  return request({
    url: '/basic/trainTeacherProcess/' + id,
    method: 'delete'
  })
}
