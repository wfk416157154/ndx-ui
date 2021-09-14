import request from '@/utils/request'

// 查询学生休学列表
export function listXiuxue(query) {
  return request({
    url: '/basic/xiuxue/list',
    method: 'get',
    params: query
  })
}

// 查询学生休学详细
export function getXiuxue(id) {
  return request({
    url: '/basic/xiuxue/' + id,
    method: 'get'
  })
}

// 新增学生休学
export function addXiuxue(data) {
  return request({
    url: '/basic/xiuxue',
    method: 'post',
    data: data
  })
}

// 修改学生休学
export function updateXiuxue(data) {
  return request({
    url: '/basic/xiuxue',
    method: 'put',
    data: data
  })
}

// 删除学生休学
export function delXiuxue(id) {
  return request({
    url: '/basic/xiuxue/' + id,
    method: 'delete'
  })
}
