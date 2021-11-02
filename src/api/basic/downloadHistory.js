import request from '@/utils/request'

// 查询下载历史记录列表
export function listDownloadHistory(query) {
  return request({
    url: '/basic/downloadHistory/list',
    method: 'get',
    params: query
  })
}

// 查询下载历史记录详细
export function getDownloadHistory(id) {
  return request({
    url: '/basic/downloadHistory/' + id,
    method: 'get'
  })
}

// 新增下载历史记录
export function addDownloadHistory(data) {
  return request({
    url: '/basic/downloadHistory',
    method: 'post',
    data: data
  })
}

// 修改下载历史记录
export function updateDownloadHistory(data) {
  return request({
    url: '/basic/downloadHistory',
    method: 'put',
    data: data
  })
}

// 删除下载历史记录
export function delDownloadHistory(id) {
  return request({
    url: '/basic/downloadHistory/' + id,
    method: 'delete'
  })
}
