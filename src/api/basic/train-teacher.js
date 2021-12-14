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