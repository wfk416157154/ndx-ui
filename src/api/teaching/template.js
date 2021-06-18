import request from '@/utils/request'

// 查询教学计划模板列表
export function listTemplate(query) {
  return request({
    url: '/basic/template/list',
    method: 'get',
    params: query
  })
}

// 查询教学计划模板详细
export function getTemplate(id) {
  return request({
    url: '/basic/template/' + id,
    method: 'get'
  })
}

// 新增教学计划模板
export function addTemplate(data) {
  return request({
    url: '/basic/template',
    method: 'post',
    data: data
  })
}

// 修改教学计划模板
export function updateTemplate(data) {
  return request({
    url: '/basic/template',
    method: 'put',
    data: data
  })
}

// 删除教学计划模板
export function delTemplate(id) {
  return request({
    url: '/basic/template/' + id,
    method: 'delete'
  })
}
