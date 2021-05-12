import request from '@/utils/request'

// 查询学生每次考试的成绩列表
export function listEverytime(query) {
  return request({
    url: '/basic/everytime/list',
    method: 'get',
    params: query
  })
}

// 查询学生每次考试的成绩详细
export function getEverytime(id) {
  return request({
    url: '/basic/everytime/' + id,
    method: 'get'
  })
}

// 新增学生每次考试的成绩
export function addEverytime(data) {
  return request({
    url: '/basic/everytime',
    method: 'post',
    data: data
  })
}

// 修改学生每次考试的成绩
export function updateEverytime(data) {
  return request({
    url: '/basic/everytime',
    method: 'put',
    data: data
  })
}

// 删除学生每次考试的成绩
export function delEverytime(id) {
  return request({
    url: '/basic/everytime/' + id,
    method: 'delete'
  })
}
