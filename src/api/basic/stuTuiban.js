import request from '@/utils/request'

// 查询学生退班列表
export function listStuTuiban(query) {
  return request({
    url: '/basic/stuTuiban/list',
    method: 'get',
    params: query
  })
}

// 查询学生退班详细
export function getStuTuiban(id) {
  return request({
    url: '/basic/stuTuiban/' + id,
    method: 'get'
  })
}

// 新增学生退班
export function addStuTuiban(data) {
  return request({
    url: '/basic/stuTuiban',
    method: 'post',
    data: data
  })
}

// 修改学生退班
export function updateStuTuiban(data) {
  return request({
    url: '/basic/stuTuiban',
    method: 'put',
    data: data
  })
}

// 删除学生退班
export function delStuTuiban(id) {
  return request({
    url: '/basic/stuTuiban/' + id,
    method: 'delete'
  })
}
