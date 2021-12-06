import request from '@/utils/request'

// 查询培训试卷-题目选项列表
export function listTrainPaperOption(query) {
  return request({
    url: '/basic/trainPaperOption/list',
    method: 'get',
    params: query
  })
}

// 查询培训试卷-题目选项详细
export function getTrainPaperOption(id) {
  return request({
    url: '/basic/trainPaperOption/' + id,
    method: 'get'
  })
}

// 新增培训试卷-题目选项
export function addTrainPaperOption(data) {
  return request({
    url: '/basic/trainPaperOption',
    method: 'post',
    data: data
  })
}

// 修改培训试卷-题目选项
export function updateTrainPaperOption(data) {
  return request({
    url: '/basic/trainPaperOption',
    method: 'put',
    data: data
  })
}

// 删除培训试卷-题目选项
export function delTrainPaperOption(id) {
  return request({
    url: '/basic/trainPaperOption/' + id,
    method: 'delete'
  })
}
