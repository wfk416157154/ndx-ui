import request from '@/utils/request'

// 查询学期配置列表
export function listTermConfig(query) {
  return request({
    url: '/basic/termConfig/list',
    method: 'get',
    params: query
  })
}

// 查询学期配置详细
export function getTermConfig(id) {
  return request({
    url: '/basic/termConfig/' + id,
    method: 'get'
  })
}

// 新增学期配置
export function addTermConfig(data) {
  return request({
    url: '/basic/termConfig',
    method: 'post',
    data: data
  })
}

// 修改学期配置
export function updateTermConfig(data) {
  return request({
    url: '/basic/termConfig',
    method: 'put',
    data: data
  })
}

// 删除学期配置
export function delTermConfig(id) {
  return request({
    url: '/basic/termConfig/' + id,
    method: 'delete'
  })
}
