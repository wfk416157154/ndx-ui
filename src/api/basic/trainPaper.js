import request from '@/utils/request'

// 查询培训试卷列表
export function listTrainPaper(query) {
  return request({
    url: '/basic/trainPaper/list',
    method: 'get',
    params: query
  })
}

// 查询培训试卷详细
export function getTrainPaper(id) {
  return request({
    url: '/basic/trainPaper/' + id,
    method: 'get'
  })
}

// 新增培训试卷
export function addTrainPaper(data) {
  return request({
    url: '/basic/trainPaper',
    method: 'post',
    data: data
  })
}

// 修改培训试卷
export function updateTrainPaper(data) {
  return request({
    url: '/basic/trainPaper',
    method: 'put',
    data: data
  })
}

// 删除培训试卷
export function delTrainPaper(id) {
  return request({
    url: '/basic/trainPaper/' + id,
    method: 'delete'
  })
}
