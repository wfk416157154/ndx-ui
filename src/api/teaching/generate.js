import request from '@/utils/request'

// 查询生成教学计划列表
export function listGenerate(query) {
  return request({
    url: '/basic/generate/list',
    method: 'get',
    params: query
  })
}

// 查询生成教学计划详细
export function getGenerate(id) {
  return request({
    url: '/basic/generate/' + id,
    method: 'get'
  })
}

// 新增生成教学计划
export function addGenerate(data) {
  return request({
    url: '/basic/generate',
    method: 'post',
    data: data
  })
}

// 修改生成教学计划
export function updateGenerate(data) {
  return request({
    url: '/basic/generate',
    method: 'put',
    data: data
  })
}

// 删除生成教学计划
export function delGenerate(id) {
  return request({
    url: '/basic/generate/' + id,
    method: 'delete'
  })
}
