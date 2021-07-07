import request from '@/utils/request'

// 查询日志发送人列表
export function listSenduser(query) {
  return request({
    url: '/basic/senduser/list',
    method: 'get',
    params: query
  })
}

// 查询日志发送人详细
export function getSenduser(id) {
  return request({
    url: '/basic/senduser/' + id,
    method: 'get'
  })
}

// 新增日志发送人
export function addSenduser(data) {
  return request({
    url: '/basic/senduser',
    method: 'post',
    data: data
  })
}

// 修改日志发送人
export function updateSenduser(data) {
  return request({
    url: '/basic/senduser',
    method: 'put',
    data: data
  })
}

// 删除日志发送人
export function delSenduser(id) {
  return request({
    url: '/basic/senduser/' + id,
    method: 'delete'
  })
}
