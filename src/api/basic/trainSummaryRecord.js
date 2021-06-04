import request from '@/utils/request'

// 查询培训总结记录列表
export function listTrainSummaryRecord(query) {
  return request({
    url: '/basic/trainSummaryRecord/list',
    method: 'get',
    params: query
  })
}

// 查询培训总结记录详细
export function getTrainSummaryRecord(id) {
  return request({
    url: '/basic/trainSummaryRecord/' + id,
    method: 'get'
  })
}

// 新增培训总结记录
export function addTrainSummaryRecord(data) {
  return request({
    url: '/basic/trainSummaryRecord',
    method: 'post',
    data: data
  })
}

// 修改培训总结记录
export function updateTrainSummaryRecord(data) {
  return request({
    url: '/basic/trainSummaryRecord',
    method: 'put',
    data: data
  })
}

// 删除培训总结记录
export function delTrainSummaryRecord(id) {
  return request({
    url: '/basic/trainSummaryRecord/' + id,
    method: 'delete'
  })
}
