import request from '@/utils/request'

// 查询学生免责列表
export function listMianze(query) {
  return request({
    url: '/basic/mianze/list',
    method: 'get',
    params: query
  })
}

// 查询学生免责详细
export function getMianze(id) {
  return request({
    url: '/basic/mianze/' + id,
    method: 'get'
  })
}

// 新增学生免责
export function addMianze(data) {
  return request({
    url: '/basic/mianze',
    method: 'post',
    data: data
  })
}

// 修改学生免责
export function updateMianze(data) {
  return request({
    url: '/basic/mianze',
    method: 'put',
    data: data
  })
}

// 删除学生免责
export function delMianze(id) {
  return request({
    url: '/basic/mianze/' + id,
    method: 'delete'
  })
}
