import request from '@/utils/request'

// 教务班级课表列表
export function bjCourseListAcdemicDean(query) {
  return request({
    url: '/basic/classCourse/bjCourseListAcdemicDean',
    method: 'get',
    params: query
  })
}

// 教务班级课表列表
export function dataStatisticsQuery(query) {
  return request({
    url: '/basic/prepareLessons/dataStatisticsQuery',
    method: 'get',
    params: query
  })
}
