import request from '@/utils/request'

// 查询文件表列表
export function listFiletable(query) {
  return request({
    url: '/file/filetable/list',
    method: 'get',
    params: query
  })
}

// 查询文件表详细
export function getFiletable(id) {
  return request({
    url: '/file/filetable/' + id,
    method: 'get'
  })
}

// 新增文件表
export function addFiletable(data) {
  return request({
    url: '/file/filetable',
    method: 'post',
    data: data
  })
}

// 修改文件表
export function updateFiletable(data) {
  return request({
    url: '/file/filetable',
    method: 'put',
    data: data
  })
}

// 删除文件表
export function delFiletable(id) {
  return request({
    url: '/file/filetable/' + id,
    method: 'delete'
  })
}
