import request from '@/utils/request'

// 查询新教师工作清单列表
export function listTeacherTasklist(query) {
  return request({
    url: '/basic/teacherTasklist/list',
    method: 'get',
    params: query
  })
}

// 查询新教师工作清单详细
export function getTeacherTasklist(id) {
  return request({
    url: '/basic/teacherTasklist/' + id,
    method: 'get'
  })
}

// 新增新教师工作清单
export function addTeacherTasklist(data) {
  return request({
    url: '/basic/teacherTasklist',
    method: 'post',
    data: data
  })
}

// 修改新教师工作清单
export function updateTeacherTasklist(data) {
  return request({
    url: '/basic/teacherTasklist',
    method: 'put',
    data: data
  })
}

// 删除新教师工作清单
export function delTeacherTasklist(id) {
  return request({
    url: '/basic/teacherTasklist/' + id,
    method: 'delete'
  })
}
