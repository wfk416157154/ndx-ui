import request from '@/utils/request'

// 查询考试成绩分析
export function groupGradeEveryTime(query) {
  return request({
    url: '/basic/everytime/groupGradeEveryTime',
    method: 'get',
    params: query
  })
}
