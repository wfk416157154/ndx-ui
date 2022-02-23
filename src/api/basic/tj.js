import request from '@/utils/request'

// 组长审核备课统计
export function leaderPrepareLessonsStatistics(query) {
  return request({
    url: '/basic/prepareLessons/leaderPrepareLessonsStatistics',
    method: 'get',
    params: query
  })
}

