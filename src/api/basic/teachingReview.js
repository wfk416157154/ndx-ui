import request from '@/utils/request'

// 查询教学计划总复习列表
export function listTeachingReview(query) {
  return request({
    url: '/basic/teachingReview/list',
    method: 'get',
    params: query
  })
}

// 查询教学计划总复习详细
export function getTeachingReview(id) {
  return request({
    url: '/basic/teachingReview/' + id,
    method: 'get'
  })
}

// 新增教学计划总复习
export function addTeachingReview(data) {
  return request({
    url: '/basic/teachingReview',
    method: 'post',
    data: data
  })
}

// 修改教学计划总复习
export function updateTeachingReview(data) {
  return request({
    url: '/basic/teachingReview',
    method: 'put',
    data: data
  })
}

// 删除教学计划总复习
export function delTeachingReview(id) {
  return request({
    url: '/basic/teachingReview/' + id,
    method: 'delete'
  })
}
