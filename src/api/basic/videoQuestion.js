import request from '@/utils/request'

// 查询视频测试题列表
export function listVideoQuestion(query) {
  return request({
    url: '/basic/videoQuestion/list',
    method: 'get',
    params: query
  })
}

// 查询视频测试题详细
export function getVideoQuestion(id) {
  return request({
    url: '/basic/videoQuestion/' + id,
    method: 'get'
  })
}

// 新增视频测试题
export function addVideoQuestion(data) {
  return request({
    url: '/basic/videoQuestion',
    method: 'post',
    data: data
  })
}

// 修改视频测试题
export function updateVideoQuestion(data) {
  return request({
    url: '/basic/videoQuestion',
    method: 'put',
    data: data
  })
}

// 删除视频测试题
export function delVideoQuestion(id) {
  return request({
    url: '/basic/videoQuestion/' + id,
    method: 'delete'
  })
}
