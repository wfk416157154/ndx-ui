import request from '@/utils/request'

// 查询培训学习记录列表
export function listLearnRecord(query) {
  return request({
    url: '/basic/learnRecord/list',
    method: 'get',
    params: query
  })
}

// 查询培训学习记录详细
export function getLearnRecord(id) {
  return request({
    url: '/basic/learnRecord/' + id,
    method: 'get'
  })
}

// 新增培训学习记录
export function addLearnRecord(data) {
  return request({
    url: '/basic/learnRecord',
    method: 'post',
    data: data
  })
}

// 修改培训学习记录
export function updateLearnRecord(data) {
  return request({
    url: '/basic/learnRecord',
    method: 'put',
    data: data
  })
}

// 删除培训学习记录
export function delLearnRecord(id) {
  return request({
    url: '/basic/learnRecord/' + id,
    method: 'delete'
  })
}
