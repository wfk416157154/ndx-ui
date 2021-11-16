import request from '@/utils/request'

// 查询培优补差列表
export function listExcellentTraining(query) {
  return request({
    url: '/basic/excellentTraining/list',
    method: 'get',
    params: query
  })
}

// 查询培优补差详细
export function getExcellentTraining(id) {
  return request({
    url: '/basic/excellentTraining/' + id,
    method: 'get'
  })
}

// 新增培优补差
export function addExcellentTraining(data) {
  return request({
    url: '/basic/excellentTraining',
    method: 'post',
    data: data
  })
}

// 修改培优补差
export function updateExcellentTraining(data) {
  return request({
    url: '/basic/excellentTraining',
    method: 'put',
    data: data
  })
}

// 删除培优补差
export function delExcellentTraining(id) {
  return request({
    url: '/basic/excellentTraining/' + id,
    method: 'delete'
  })
}


// 查询培优补差学生列表
export function listExcellentTrainingStudent(query) {
  return request({
    url: '/basic/excellentTrainingStudent/list',
    method: 'get',
    params: query
  })
}

// 查询培优补差学生详细
export function getExcellentTrainingStudent(id) {
  return request({
    url: '/basic/excellentTrainingStudent/' + id,
    method: 'get'
  })
}

// 新增培优补差学生
export function addExcellentTrainingStudent(data) {
  return request({
    url: '/basic/excellentTrainingStudent',
    method: 'post',
    data: data
  })
}

// 修改培优补差学生
export function updateExcellentTrainingStudent(data) {
  return request({
    url: '/basic/excellentTrainingStudent',
    method: 'put',
    data: data
  })
}

// 删除培优补差学生
export function delExcellentTrainingStudent(id) {
  return request({
    url: '/basic/excellentTrainingStudent/' + id,
    method: 'delete'
  })
}

