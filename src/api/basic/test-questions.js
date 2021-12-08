import request from '@/utils/request'

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

// 查询视频测试题列表
export function listVideoQuestion(query) {
  return request({
    url: '/basic/videoQuestion/list',
    method: 'get',
    params: query
  })
}

// 删除视频测试题
export function deleteVideoQuestion(id) {
  return request({
    url: '/basic/videoQuestion/' + id,
    method: 'delete'
  })
}

// 获取视频测试题的详细信息
export function getVideoQuestion(id) {
  return request({
    url: '/basic/videoQuestion/' + id,
    method: 'get'
  })
}
