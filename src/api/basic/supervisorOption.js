import request from '@/utils/request'

// 查询督导会议-组员选项列表
export function listSupervisorOption(query) {
  return request({
    url: '/basic/supervisorOption/list',
    method: 'get',
    params: query
  })
}

// 查询督导会议-组员选项详细
export function getSupervisorOption(id) {
  return request({
    url: '/basic/supervisorOption/' + id,
    method: 'get'
  })
}

// 新增督导会议-组员选项
export function addSupervisorOption(data) {
  return request({
    url: '/basic/supervisorOption',
    method: 'post',
    data: data
  })
}

// 修改督导会议-组员选项
export function updateSupervisorOption(data) {
  return request({
    url: '/basic/supervisorOption',
    method: 'put',
    data: data
  })
}

// 删除督导会议-组员选项
export function delSupervisorOption(id) {
  return request({
    url: '/basic/supervisorOption/' + id,
    method: 'delete'
  })
}
