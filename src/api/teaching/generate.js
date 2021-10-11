import request from '@/utils/request'

// 查询生成教学计划列表
export function listGenerate(query) {
  return request({
    url: '/basic/teachingGenerate/list',
    method: 'get',
    params: query
  })
}

// 查询生成教学计划详细
export function getGenerate(id) {
  return request({
    url: '/basic/teachingGenerate/' + id,
    method: 'get'
  })
}

// 新增生成教学计划
export function addGenerate(data) {
  return request({
    url: '/basic/teachingGenerate',
    method: 'post',
    data: data
  })
}

// 修改生成教学计划
export function updateGenerate(data) {
  return request({
    url: '/basic/teachingGenerate',
    method: 'put',
    data: data
  })
}

// 删除生成教学计划
export function delGenerate(id) {
  return request({
    url: '/basic/teachingGenerate/' + id,
    method: 'delete'
  })
}

// 新增生成教学计划-跳过时间
export function addSkiptime(data) {
  return request({
    url: '/basic/skiptime',
    method: 'post',
    data: data
  })
}

// 修改生成教学计划-跳过时间
export function editSkiptime(data) {
  return request({
    url: '/basic/skiptime',
    method: 'put',
    data: data
  })
}

// 删除生成教学计划-跳过时间
export function deleteSkiptime(id) {
  return request({
    url: '/basic/skiptime/' + id,
    method: 'delete'
  })
}

// 查询生成教学计划-跳过时间列表
export function listSkiptime(query) {
  return request({
    url: '/basic/skiptime/list',
    method: 'get',
    params: query
  })
}

// 手动生成教学计划
export function generateTeachingHandle(data) {
  return request({
    url: '/basic/teachingGenerate/generateTeachingHandle',
    method: 'post',
    data: data
  })
}
