import request from '@/utils/request'

// 查询作文列表
export function listComposition(query) {
  return request({
    url: '/basic/composition/list',
    method: 'get',
    params: query
  })
}

// 查询作文详细
export function getComposition(id) {
  return request({
    url: '/basic/composition/' + id,
    method: 'get'
  })
}

// 新增作文
export function addComposition(data) {
  return request({
    url: '/basic/composition',
    method: 'post',
    data: data
  })
}

// 修改作文
export function updateComposition(data) {
  return request({
    url: '/basic/composition',
    method: 'put',
    data: data
  })
}

// 删除作文
export function delComposition(id) {
  return request({
    url: '/basic/composition/' + id,
    method: 'delete'
  })
}
