import request from '@/utils/request'

// 查询考卷列表
export function listExaminationPaper(query) {
  return request({
    url: '/basic/examinationPaper/list',
    method: 'get',
    params: query
  })
}

// 查询未上传成绩的考卷列表
export function queryNotUploadGradeExamlist(query) {
  return request({
    url: '/basic/examinationPaper/queryNotUploadGradeExamlist',
    method: 'get',
    params: query
  })
}

// 查询考卷详细
export function getExaminationPaper(id) {
  return request({
    url: '/basic/examinationPaper/' + id,
    method: 'get'
  })
}

// 新增考卷
export function addExaminationPaper(data) {
  return request({
    url: '/basic/examinationPaper',
    method: 'post',
    data: data
  })
}

// 修改考卷
export function updateExaminationPaper(data) {
  return request({
    url: '/basic/examinationPaper',
    method: 'put',
    data: data
  })
}

// 删除考卷
export function delExaminationPaper(id) {
  return request({
    url: '/basic/examinationPaper/' + id,
    method: 'delete'
  })
}
