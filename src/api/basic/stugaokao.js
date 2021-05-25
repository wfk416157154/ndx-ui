import request from '@/utils/request'

// 查询学生高考成绩列表
export function listStugaokao(query) {
  return request({
    url: '/basic/stugaokao/list',
    method: 'get',
    params: query
  })
}

// 查询学生高考成绩详细
export function getStugaokao(id) {
  return request({
    url: '/basic/stugaokao/' + id,
    method: 'get'
  })
}

// 新增学生高考成绩
export function addStugaokao(data) {
  return request({
    url: '/basic/stugaokao',
    method: 'post',
    data: data
  })
}

// 修改学生高考成绩
export function updateStugaokao(data) {
  return request({
    url: '/basic/stugaokao',
    method: 'put',
    data: data
  })
}

// 删除学生高考成绩
export function delStugaokao(id) {
  return request({
    url: '/basic/stugaokao/' + id,
    method: 'delete'
  })
}
