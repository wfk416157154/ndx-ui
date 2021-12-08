import request from '@/utils/request'

// 查询培训课程列表
export function listCurriculum(query) {
  return request({
    url: '/basic/curriculum/list',
    method: 'get',
    params: query
  })
}

// 查询培训课程详细
export function getCurriculum(id) {
  return request({
    url: '/basic/curriculum/' + id,
    method: 'get'
  })
}

// 新增培训课程
export function addCurriculum(data) {
  return request({
    url: '/basic/curriculum',
    method: 'post',
    data: data
  })
}

// 修改培训课程
export function updateCurriculum(data) {
  return request({
    url: '/basic/curriculum',
    method: 'put',
    data: data
  })
}

// 删除培训课程
export function delCurriculum(id) {
  return request({
    url: '/basic/curriculum/' + id,
    method: 'delete'
  })
}
