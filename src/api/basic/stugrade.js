import request from '@/utils/request'

// 查询学生成绩基础表列表
export function listStugrade(query) {
  return request({
    url: '/basic/stugrade/list',
    method: 'get',
    params: query
  })
}
// 查询学生成绩基础表列数据
export function listAll(query) {
  return request({
    url: '/basic/stugrade/listAll',
    method: 'get',
    params: query
  })
}

// 同步学生每次考试的名称至考卷表中
export function syncKsmcToExaminationPaper(query) {
  return request({
    url: '/basic/stugrade/syncKsmcToExaminationPaper',
    method: 'post',
    params: query
  })
}

// 查询学生成绩基础表列名
export function getColumnNameList(query) {
  return request({
    url: '/basic/stugrade/getColumnNameList',
    method: 'get',
    params: query
  })
}

// 统计学生的每次考试成绩和成绩统计分析
export function getStudentGradeEverytime(query) {
  return request({
    url: '/basic/stugrade/getStudentGradeEverytime',
    method: 'get',
    params: query
  })
}

// 查询学生成绩基础表详细
export function getStugrade(id) {
  return request({
    url: '/basic/stugrade/' + id,
    method: 'get'
  })
}

// 新增学生成绩基础表
export function addStugrade(data) {
  return request({
    url: '/basic/stugrade',
    method: 'post',
    data: data
  })
}

// 修改学生成绩基础表
export function updateStugrade(data) {
  return request({
    url: '/basic/stugrade',
    method: 'put',
    data: data
  })
}

// 删除学生成绩基础表
export function delStugrade(id) {
  return request({
    url: '/basic/stugrade/' + id,
    method: 'delete'
  })
}
