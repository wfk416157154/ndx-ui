import request from '@/utils/request'

// 查询学生成绩基础表列表
export function listStugrade(query) {
  return request({
    url: '/basic/stugrade/list',
    method: 'get',
    params: query
  })
}

// 查询学生成绩基础表详细
export function getStugrade(id) {
  return request({
    url: '/basic/stugrade/' + id,
    method: 'get'
  })
}

// 新增学生成绩基础表
export function addStugrade(data) {
  return request({
    url: '/basic/stugrade',
    method: 'post',
    data: data
  })
}

// 修改学生成绩基础表
export function updateStugrade(data) {
  return request({
    url: '/basic/stugrade',
    method: 'put',
    data: data
  })
}

// 删除学生成绩基础表
export function delStugrade(id) {
  return request({
    url: '/basic/stugrade/' + id,
    method: 'delete'
  })
}
