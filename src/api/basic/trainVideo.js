import request from '@/utils/request'

// 查询培训视频列表
export function listTrainVideo(query) {
  return request({
    url: '/basic/trainVideo/list',
    method: 'get',
    params: query
  })
}

// 查询培训视频详细
export function getTrainVideo(id) {
  return request({
    url: '/basic/trainVideo/' + id,
    method: 'get'
  })
}

// 新增培训视频
export function addTrainVideo(data) {
  return request({
    url: '/basic/trainVideo',
    method: 'post',
    data: data
  })
}

// 修改培训视频
export function updateTrainVideo(data) {
  return request({
    url: '/basic/trainVideo',
    method: 'put',
    data: data
  })
}

// 删除培训视频
export function delTrainVideo(id) {
  return request({
    url: '/basic/trainVideo/' + id,
    method: 'delete'
  })
}
