import request from '@/utils/request'

// 查询培训试卷列表
export function listTrainPaper(query) {
  return request({
    url: '/basic/trainPaper/list',
    method: 'get',
    params: query
  })
}

// 查询培训试卷-题目列表(表格)
export function trainPaperTopicList(query) {
  return request({
    url: '/basic/trainPaperTopic/list',
    method: 'get',
    params: query
  })
}

// 查询培训试卷-编辑题目(按题目类型分类)
export function topicTypeList(query) {
  return request({
    url: '/basic/trainPaperTopic/topicTypeList',
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

// 新增培训试卷-关联题目
export function addPaperWithTopic(data) {
  return request({
    url: '/basic/trainPaperTopic/addPaperWithTopic',
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
