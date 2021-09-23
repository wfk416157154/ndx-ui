import request from '@/utils/request'

// 查询教学计划模板列表
export function listTeachingTemplate(query) {
  return request({
    url: '/basic/teachingTemplate/list',
    method: 'get',
    params: query
  })
}

// 查询教学计划模板详细
export function getTeachingTemplate(id) {
  return request({
    url: '/basic/teachingTemplate/' + id,
    method: 'get'
  })
}

// 新增教学计划模板
export function addTeachingTemplate(data) {
  return request({
    url: '/basic/teachingTemplate',
    method: 'post',
    data: data
  })
}

// 修改教学计划模板
export function updateTeachingTemplate(data) {
  return request({
    url: '/basic/teachingTemplate',
    method: 'put',
    data: data
  })
}

// 删除教学计划模板
export function delTeachingTemplate(id) {
  return request({
    url: '/basic/teachingTemplate/' + id,
    method: 'delete'
  })
}
