import request from '@/utils/request'

// 查询教学计划模板-教学任务列表
export function listTask(query) {
  return request({
    url: '/basic/task/list',
    method: 'get',
    params: query
  })
}

// 查询教学计划模板-教学任务详细
export function getTask(id) {
  return request({
    url: '/basic/task/' + id,
    method: 'get'
  })
}

// 新增教学计划模板-教学任务
export function addTask(data) {
  return request({
    url: '/basic/task',
    method: 'post',
    data: data
  })
}

// 修改教学计划模板-教学任务
export function updateTask(data) {
  return request({
    url: '/basic/task',
    method: 'put',
    data: data
  })
}

// 删除教学计划模板-教学任务
export function delTask(id) {
  return request({
    url: '/basic/task/' + id,
    method: 'delete'
  })
}
