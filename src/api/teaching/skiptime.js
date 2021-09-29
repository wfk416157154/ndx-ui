import request from '@/utils/request'

// 查询生成教学计划-跳过时间列表
export function listSkiptime(query) {
  return request({
    url: '/basic/skiptime/list',
    method: 'get',
    params: query
  })
}

// 查询生成教学计划-跳过时间详细
export function getSkiptime(id) {
  return request({
    url: '/basic/skiptime/' + id,
    method: 'get'
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
export function updateSkiptime(data) {
  return request({
    url: '/basic/skiptime',
    method: 'put',
    data: data
  })
}

// 删除生成教学计划-跳过时间
export function delSkiptime(id) {
  return request({
    url: '/basic/skiptime/' + id,
    method: 'delete'
  })
}
