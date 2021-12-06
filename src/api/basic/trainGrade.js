import request from '@/utils/request'

// 查询培训试卷成绩列表
export function listTrainGrade(query) {
  return request({
    url: '/basic/trainGrade/list',
    method: 'get',
    params: query
  })
}

// 查询培训试卷成绩详细
export function getTrainGrade(id) {
  return request({
    url: '/basic/trainGrade/' + id,
    method: 'get'
  })
}

// 新增培训试卷成绩
export function addTrainGrade(data) {
  return request({
    url: '/basic/trainGrade',
    method: 'post',
    data: data
  })
}

// 修改培训试卷成绩
export function updateTrainGrade(data) {
  return request({
    url: '/basic/trainGrade',
    method: 'put',
    data: data
  })
}

// 删除培训试卷成绩
export function delTrainGrade(id) {
  return request({
    url: '/basic/trainGrade/' + id,
    method: 'delete'
  })
}
