import request from '@/utils/request'

// 查询培训内容（默认单选项）列表
export function listTrainSingle(query) {
  return request({
    url: '/basic/trainSingle/list',
    method: 'get',
    params: query
  })
}

// 查询培训内容（默认单选项）详细
export function getTrainSingle(id) {
  return request({
    url: '/basic/trainSingle/' + id,
    method: 'get'
  })
}

// 新增培训内容（默认单选项）
export function addTrainSingle(data) {
  return request({
    url: '/basic/trainSingle',
    method: 'post',
    data: data
  })
}

// 修改培训内容（默认单选项）
export function updateTrainSingle(data) {
  return request({
    url: '/basic/trainSingle',
    method: 'put',
    data: data
  })
}

// 删除培训内容（默认单选项）
export function delTrainSingle(id) {
  return request({
    url: '/basic/trainSingle/' + id,
    method: 'delete'
  })
}
