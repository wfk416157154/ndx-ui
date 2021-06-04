import request from '@/utils/request'

// 查询培训内容记录列表
export function listTrainContentRecord(query) {
  return request({
    url: '/basic/trainContentRecord/list',
    method: 'get',
    params: query
  })
}

// 查询培训内容记录详细
export function getTrainContentRecord(id) {
  return request({
    url: '/basic/trainContentRecord/' + id,
    method: 'get'
  })
}

// 新增培训内容记录
export function addTrainContentRecord(data) {
  return request({
    url: '/basic/trainContentRecord',
    method: 'post',
    data: data
  })
}

// 修改培训内容记录
export function updateTrainContentRecord(data) {
  return request({
    url: '/basic/trainContentRecord',
    method: 'put',
    data: data
  })
}

// 删除培训内容记录
export function delTrainContentRecord(id) {
  return request({
    url: '/basic/trainContentRecord/' + id,
    method: 'delete'
  })
}
