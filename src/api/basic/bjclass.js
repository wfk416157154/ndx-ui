import request from '@/utils/request'

// 查询班级基础信息列表
export function listBjclass(query) {
  return request({
    url: '/basic/bjclass/list',
    method: 'get',
    params: query
  })
}

// 班级绩效考核
export function classPerformance(query) {
  return request({
    url: '/basic/bjclass/classPerformance',
    method: 'get',
    params: query
  })
}

// 查询班级基础信息列表（页面查询调用）
export function pageListBjclass(query) {
  return request({
    url: '/basic/bjclass/pageList',
    method: 'get',
    params: query
  })
}


// 查询班级基础信息详细
export function getBjclass(id) {
  return request({
    url: '/basic/bjclass/' + id,
    method: 'get'
  })
}

// 新增班级基础信息
export function addBjclass(data) {
  return request({
    url: '/basic/bjclass',
    method: 'post',
    data: data
  })
}

// 导出班级绩效考核
export function exportClassPerformance(data) {
  return request({
    url: '/basic/bjclass/exportClassPerformance',
    method: 'post',
    data: data
  })
}

// 修改班级基础信息
export function updateBjclass(data) {
  return request({
    url: '/basic/bjclass',
    method: 'put',
    data: data
  })
}

// 删除班级基础信息
export function delBjclass(id) {
  return request({
    url: '/basic/bjclass/' + id,
    method: 'delete'
  })
}


