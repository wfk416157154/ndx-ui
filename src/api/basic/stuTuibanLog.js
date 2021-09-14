import request from '@/utils/request'

// 查询学生退班-流程记录列表
export function listStuTuibanLog(query) {
  return request({
    url: '/basic/stuTuibanLog/list',
    method: 'get',
    params: query
  })
}

// 查询学生退班-流程记录详细
export function getStuTuibanLog(id) {
  return request({
    url: '/basic/stuTuibanLog/' + id,
    method: 'get'
  })
}

// 新增学生退班-流程记录
export function addStuTuibanLog(data) {
  return request({
    url: '/basic/stuTuibanLog',
    method: 'post',
    data: data
  })
}

// 修改学生退班-流程记录
export function updateStuTuibanLog(data) {
  return request({
    url: '/basic/stuTuibanLog',
    method: 'put',
    data: data
  })
}

// 删除学生退班-流程记录
export function delStuTuibanLog(id) {
  return request({
    url: '/basic/stuTuibanLog/' + id,
    method: 'delete'
  })
}
