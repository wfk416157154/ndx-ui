import request from '@/utils/request'

// 查询督导会议记录列表
export function listSupervisor(query) {
  return request({
    url: '/basic/supervisor/list',
    method: 'get',
    params: query
  })
}

// 查询用户集合
export function listUser(query) {
  return request({
    url: '/basic/supervisor/getUserList',
    method: 'get',
    params: query
  })
}

// 查询部门集合
export function listDept(query) {
  return request({
    url: '/basic/supervisor/getDeptList',
    method: 'get',
    params: query
  })
}

// 查询督导会议记录详细
export function getSupervisor(id) {
  return request({
    url: '/basic/supervisor/' + id,
    method: 'get'
  })
}

// 获取登录用户(组长角色)下的组员
export function getLoginUnderGroup() {
  return request({
    url: '/basic/supervisor/getLoginUnderGroup',
    method: 'get'
  })
}


// 新增或修改督导会议记录
export function addOrUpdateSupervisor(data) {
  return request({
    url: '/basic/supervisor/addOrUpdate',
    method: 'post',
    data: data
  })
}

// 新增督导会议记录
export function addSupervisor(data) {
  return request({
    url: '/basic/supervisor',
    method: 'post',
    data: data
  })
}

// 修改督导会议记录
export function updateSupervisor(data) {
  return request({
    url: '/basic/supervisor',
    method: 'put',
    data: data
  })
}

// 删除督导会议记录
export function delSupervisor(id) {
  return request({
    url: '/basic/supervisor/' + id,
    method: 'delete'
  })
}
