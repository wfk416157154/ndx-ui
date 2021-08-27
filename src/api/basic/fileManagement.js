import request from '@/utils/request'

// 查询文件管理列表
export function listFileManagement(query) {
  return request({
    url: '/basic/fileManagement/list',
    method: 'get',
    params: query
  })
}

// 查询文件管理详细
export function getFileManagement(id) {
  return request({
    url: '/basic/fileManagement/' + id,
    method: 'get'
  })
}

// 新增文件管理
export function addFileManagement(data) {
  return request({
    url: '/basic/fileManagement',
    method: 'post',
    data: data
  })
}

// 修改文件管理
export function updateFileManagement(data) {
  return request({
    url: '/basic/fileManagement',
    method: 'put',
    data: data
  })
}

// 删除文件管理
export function delFileManagement(id) {
  return request({
    url: '/basic/fileManagement/' + id,
    method: 'delete'
  })
}
