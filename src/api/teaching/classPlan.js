import request from '@/utils/request'

// 查询班级教学计划列表
export function listClassPlan(query) {
  return request({
    url: '/basic/classPlan/list',
    method: 'get',
    params: query
  })
}

// 教务/管理员查询班级教学计划列表
export function adminList(query) {
  return request({
    url: '/basic/classPlan/adminList',
    method: 'get',
    params: query
  })
}

// 更新班级教学计划统计结果列表
export function updateClassPlanResult(query) {
  return request({
    url: '/basic/classPlan/updateClassPlanResultList',
    method: 'get',
    params: query
  })
}

// 查询班级教学计划详细
export function getClassPlan(id) {
  return request({
    url: '/basic/classPlan/' + id,
    method: 'get'
  })
}

// 新增班级教学计划
export function addClassPlan(data) {
  return request({
    url: '/basic/classPlan',
    method: 'post',
    data: data
  })
}

// 修改班级教学计划
export function updateClassPlan(data) {
  return request({
    url: '/basic/classPlan',
    method: 'put',
    data: data
  })
}

// 删除班级教学计划
export function delClassPlan(id) {
  return request({
    url: '/basic/classPlan/' + id,
    method: 'delete'
  })
}
