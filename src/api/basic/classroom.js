import request from '@/utils/request'

// 查询教室图片列表
export function listClassroom(query) {
  return request({
    url: '/basic/classroom/list',
    method: 'get',
    params: query
  })
}

// 查询教室图片详细
export function getClassroom(id) {
  return request({
    url: '/basic/classroom/' + id,
    method: 'get'
  })
}

// 新增教室图片
export function addClassroom(data) {
  return request({
    url: '/basic/classroom',
    method: 'post',
    data: data
  })
}

// 修改教室图片
export function updateClassroom(data) {
  return request({
    url: '/basic/classroom',
    method: 'put',
    data: data
  })
}

// 删除教室图片
export function delClassroom(id) {
  return request({
    url: '/basic/classroom/' + id,
    method: 'delete'
  })
}
