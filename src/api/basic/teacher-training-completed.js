import request from '@/utils/request'

// 查询-已完成培训的老师的每次考试成绩和开始培训至培训完成的时间
export function trainResultList(query) {
  return request({
    url: '/basic/learnRecord/trainResultList',
    method: 'get',
    params: query
  })
}

// 查询老师培训过程列表
export function trainTeacherProcess(query) {
  return request({
    url: '/basic/trainTeacherProcess/list',
    method: 'get',
    params: query
  })
}

// 查询该老师所有已上传的笔记图片
export function notesList(query) {
  return request({
    url: '/basic/trainTeacherProcess/notesList',
    method: 'get',
    params: query
  })
}

// 新增或修改老师培训过程
export function addOrUpdate(data) {
  return request({
    url: '/basic/trainTeacherProcess/addOrUpdate',
    method: 'post',
    data: data
  })
}
