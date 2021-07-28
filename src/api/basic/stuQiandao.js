import request from '@/utils/request'

// 查询学生课堂签到列表
export function listStuQiandao(query) {
  return request({
    url: '/basic/stuQiandao/list',
    method: 'get',
    params: query
  })
}

// 查询学生课堂签到详细
export function getStuQiandao(id) {
  return request({
    url: '/basic/stuQiandao/' + id,
    method: 'get'
  })
}

// 新增学生课堂签到
export function addStuQiandao(data) {
  return request({
    url: '/basic/stuQiandao',
    method: 'post',
    data: data
  })
}

// 修改学生课堂签到
export function updateStuQiandao(data) {
  return request({
    url: '/basic/stuQiandao',
    method: 'put',
    data: data
  })
}

// 删除学生课堂签到
export function delStuQiandao(id) {
  return request({
    url: '/basic/stuQiandao/' + id,
    method: 'delete'
  })
}
