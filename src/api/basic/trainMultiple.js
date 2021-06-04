import request from '@/utils/request'

// 查询培训内容（多选）列表
export function listTrainMultiple(query) {
  return request({
    url: '/basic/trainMultiple/list',
    method: 'get',
    params: query
  })
}

// 查询培训内容（多选）详细
export function getTrainMultiple(id) {
  return request({
    url: '/basic/trainMultiple/' + id,
    method: 'get'
  })
}

// 新增培训内容（多选）
export function addTrainMultiple(data) {
  return request({
    url: '/basic/trainMultiple',
    method: 'post',
    data: data
  })
}

// 修改培训内容（多选）
export function updateTrainMultiple(data) {
  return request({
    url: '/basic/trainMultiple',
    method: 'put',
    data: data
  })
}

// 删除培训内容（多选）
export function delTrainMultiple(id) {
  return request({
    url: '/basic/trainMultiple/' + id,
    method: 'delete'
  })
}
