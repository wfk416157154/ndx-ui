import request from '@/utils/request'

// 组长审核备课统计
export function leaderPrepareLessonsStatistics(query) {
  return request({
    url: '/basic/prepareLessons/leaderPrepareLessonsStatistics',
    method: 'get',
    params: query
  })
}

// 课程进度
export function ListPlanProgress(query) {
  return request({
    url: '/basic/planProgress/list',
    method: 'get',
    params: query
  })
}

