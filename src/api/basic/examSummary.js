import request from '@/utils/request'

// 查询考试分析总结列表
export function listExamSummary(query) {
  return request({
    url: '/basic/examSummary/list',
    method: 'get',
    params: query
  })
}

// 查询考试分析总结详细
export function getExamSummary(id) {
  return request({
    url: '/basic/examSummary/' + id,
    method: 'get'
  })
}

// 新增考试分析总结
export function addExamSummary(data) {
  return request({
    url: '/basic/examSummary',
    method: 'post',
    data: data
  })
}

// 修改考试分析总结
export function updateExamSummary(data) {
  return request({
    url: '/basic/examSummary',
    method: 'put',
    data: data
  })
}

// 删除考试分析总结
export function delExamSummary(id) {
  return request({
    url: '/basic/examSummary/' + id,
    method: 'delete'
  })
}
