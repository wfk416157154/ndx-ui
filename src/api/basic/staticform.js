import request from '@/utils/request'

// 查询培训内容静态单列表
export function listStaticform(query) {
  return request({
    url: '/basic/staticform/list',
    method: 'get',
    params: query
  })
}

// 查询培训内容静态单详细
export function getStaticform(id) {
  return request({
    url: '/basic/staticform/' + id,
    method: 'get'
  })
}

// 新增培训内容静态单
export function addStaticform(data) {
  return request({
    url: '/basic/staticform',
    method: 'post',
    data: data
  })
}

// 修改培训内容静态单
export function updateStaticform(data) {
  return request({
    url: '/basic/staticform',
    method: 'put',
    data: data
  })
}

// 删除培训内容静态单
export function delStaticform(id) {
  return request({
    url: '/basic/staticform/' + id,
    method: 'delete'
  })
}
