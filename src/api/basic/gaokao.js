import request from '@/utils/request'

// 查询班级高考成绩列表
export function listGaokao(query) {
  return request({
    url: '/basic/gaokao/list',
    method: 'get',
    params: query
  })
}

// 查询班级高考成绩详细
export function getGaokao(id) {
  return request({
    url: '/basic/gaokao/' + id,
    method: 'get'
  })
}

// 新增班级高考成绩
export function addGaokao(data) {
  return request({
    url: '/basic/gaokao',
    method: 'post',
    data: data
  })
}

// 修改班级高考成绩
export function updateGaokao(data) {
  return request({
    url: '/basic/gaokao',
    method: 'put',
    data: data
  })
}

// 删除班级高考成绩
export function delGaokao(id) {
  return request({
    url: '/basic/gaokao/' + id,
    method: 'delete'
  })
}
