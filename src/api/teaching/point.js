import request from '@/utils/request'

// 查询教学计划模板-教学任务点列表
export function listPoint(query) {
  return request({
    url: '/basic/point/list',
    method: 'get',
    params: query
  })
}

// 查询教学计划模板-教学任务点详细
export function getPoint(id) {
  return request({
    url: '/basic/point/' + id,
    method: 'get'
  })
}

// 新增教学计划模板-教学任务点
export function addPoint(data) {
  return request({
    url: '/basic/point',
    method: 'post',
    data: data
  })
}

// 修改教学计划模板-教学任务点
export function updatePoint(data) {
  return request({
    url: '/basic/point',
    method: 'put',
    data: data
  })
}

// 删除教学计划模板-教学任务点
export function delPoint(id) {
  return request({
    url: '/basic/point/' + id,
    method: 'delete'
  })
}
