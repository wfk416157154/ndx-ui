import request from '@/utils/request'

// 查询学生日常表现列表
export function listPerformance(query) {
  return request({
    url: '/basic/performance/list',
    method: 'get',
    params: query
  })
}

// 查询学生日常表现详细
export function getPerformance(id) {
  return request({
    url: '/basic/performance/' + id,
    method: 'get'
  })
}

// 新增学生日常表现
export function addPerformance(data) {
  return request({
    url: '/basic/performance',
    method: 'post',
    data: data
  })
}

// 修改学生日常表现
export function updatePerformance(data) {
  return request({
    url: '/basic/performance',
    method: 'put',
    data: data
  })
}

// 删除学生日常表现
export function delPerformance(id) {
  return request({
    url: '/basic/performance/' + id,
    method: 'delete'
  })
}
