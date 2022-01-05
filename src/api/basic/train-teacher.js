import request from '@/utils/request'

// 查询-已分配给老师需要考试的培训试卷
export function getExamList(query) {
  return request({
    url: '/basic/learnRecord/examList',
    method: 'get',
    params: query
  })
}

// 查询-已分配给老师需要看的视频培训课程
export function getVideoList(query) {
  return request({
    url: '/basic/learnRecord/videoList',
    method: 'get',
    params: query
  })
}

// 查询-老师考试列表
export function teacherExamList(query) {
  return request({
    url: '/basic/trainPaper/teacherExamList',
    method: 'get',
    params: query
  })
}

// 新增或修改老师培训过程
export function trainTeacherProcess(data) {
  return request({
    url: '/basic/trainTeacherProcess/addOrUpdate',
    method: 'post',
    data: data
  })
}
