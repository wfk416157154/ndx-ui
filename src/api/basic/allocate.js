import request from '@/utils/request'

// 查询培训分配列表
export function listAllocate(query) {
  return request({
    url: '/basic/allocate/list',
    method: 'get',
    params: query
  })
}

// 查询培训分配详细
export function getAllocate(id) {
  return request({
    url: '/basic/allocate/' + id,
    method: 'get'
  })
}

// 新增培训分配
export function addAllocate(data) {
  return request({
    url: '/basic/allocate',
    method: 'post',
    data: data
  })
}

// 修改培训分配
export function updateAllocate(data) {
  return request({
    url: '/basic/allocate',
    method: 'put',
    data: data
  })
}

// 删除培训分配
export function delAllocate(id) {
  return request({
    url: '/basic/allocate/' + id,
    method: 'delete'
  })
}
