import request from '@/utils/request'

// 查询老师日志考勤结果统计任务列表
export function listStatisticsTask(query) {
  return request({
    url: '/basic/statisticsTask/list',
    method: 'get',
    params: query
  })
}

// 查询老师日志考勤结果统计任务详细
export function getStatisticsTask(id) {
  return request({
    url: '/basic/statisticsTask/' + id,
    method: 'get'
  })
}

// 新增老师日志考勤结果统计任务
export function addStatisticsTask(data) {
  return request({
    url: '/basic/statisticsTask',
    method: 'post',
    data: data
  })
}

// 修改老师日志考勤结果统计任务
export function updateStatisticsTask(data) {
  return request({
    url: '/basic/statisticsTask',
    method: 'put',
    data: data
  })
}

// 删除老师日志考勤结果统计任务
export function delStatisticsTask(id) {
  return request({
    url: '/basic/statisticsTask/' + id,
    method: 'delete'
  })
}
