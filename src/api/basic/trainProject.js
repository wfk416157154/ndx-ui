import request from '@/utils/request'

// 查询培训项目列表
export function listTrainProject(query) {
  return request({
    url: '/basic/trainProject/list',
    method: 'get',
    params: query
  })
}

// 查询培训项目详细
export function getTrainProject(id) {
  return request({
    url: '/basic/trainProject/' + id,
    method: 'get'
  })
}

// 新增培训项目
export function addTrainProject(data) {
  return request({
    url: '/basic/trainProject',
    method: 'post',
    data: data
  })
}

// 修改培训项目
export function updateTrainProject(data) {
  return request({
    url: '/basic/trainProject',
    method: 'put',
    data: data
  })
}

// 删除培训项目
export function delTrainProject(id) {
  return request({
    url: '/basic/trainProject/' + id,
    method: 'delete'
  })
}
