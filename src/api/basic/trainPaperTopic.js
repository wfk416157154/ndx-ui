import request from '@/utils/request'

// 查询培训试卷-题目列表
export function listTrainPaperTopic(query) {
  return request({
    url: '/basic/trainPaperTopic/list',
    method: 'get',
    params: query
  })
}

// 查询培训试卷-题目详细
export function getTrainPaperTopic(id) {
  return request({
    url: '/basic/trainPaperTopic/' + id,
    method: 'get'
  })
}

// 新增或修改 培训试卷-题目
export function addOrUpdateTrainPaperTopic(data) {
  return request({
    url: '/basic/trainPaperTopic/addOrEdit',
    method: 'post',
    data: data
  })
}

// 新增培训试卷-题目
export function addTrainPaperTopic(data) {
  return request({
    url: '/basic/trainPaperTopic',
    method: 'post',
    data: data
  })
}

// 修改培训试卷-题目
export function updateTrainPaperTopic(data) {
  return request({
    url: '/basic/trainPaperTopic',
    method: 'put',
    data: data
  })
}

// 删除培训试卷-题目
export function delTrainPaperTopic(id) {
  return request({
    url: '/basic/trainPaperTopic/' + id,
    method: 'delete'
  })
}
