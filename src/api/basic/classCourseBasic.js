import request from '@/utils/request'

// 复制课表的提交方法
export function copyCourseBasicApi(data) {
  return request({
    url: '/basic/classCourseBasic/copyCourseBasicDetail',
    method: 'post',
    data: data
  })
}

// 查询班级课程基本列表
export function listClassCourseBasic(query) {
  return request({
    url: '/basic/classCourseBasic/list',
    method: 'get',
    params: query
  })
}

// 查询班级课程基本详细
export function getClassCourseBasic(id) {
  return request({
    url: '/basic/classCourseBasic/' + id,
    method: 'get'
  })
}

// 查询老师课表
export function teaEnableCourseQuery(id) {
  return request({
    url: '/basic/classCourseBasic/teaEnableCourseQuery/' + id,
    method: 'get'
  })
}

// 获取班级启用课表
export function getClassEnableCourse(id) {
  return request({
    url: '/basic/classCourse/getClassEnableCourse/' + id,
    method: 'get'
  })
}
// 学生签到数据查询
export function stuQiandaoHomePageQuery(query) {
  return request({
    url: '/basic/stuQiandao/stuQiandaoHomePageQuery',
    method: 'get',
    params: query
  })
}

// 学生签到数据详情页查询
export function stuQiandaoDetailQuery(query) {
  return request({
    url: '/basic/stuQiandao/stuBjkcQianDaoXq',
    method: 'get',
    params: query
  })
}

// 签到
export function batchCheckIn(data) {
  return request({
    url: '/basic/stuQiandao/batchCheckIn',
    method: 'post',
    data: data
  })
}

// 新增课表模板
export function classCourseTemplateAdd(data) {
  return request({
    url: '/basic/classCourseBasic/classCourseTemplateAdd',
    method: 'post',
    data: data
  })
}

// 签到异常
export function batchYiChang(data) {
  return request({
    url: '/basic/stuQiandao/batchYiChang',
    method: 'post',
    data: data
  })
}

// 新增班级课程基本
export function addClassCourseBasic(data) {
  return request({
    url: '/basic/classCourseBasic',
    method: 'post',
    data: data
  })
}


// 复制课表
export function copyCourseTemplate(data) {
  return request({
    url: '/basic/classCourseBasic/copyCourseTemplate',
    method: 'post',
    data: data
  })
}

// 开启课表
export function enableClassCourseTemplate(data) {
  return request({
    url: '/basic/classCourseBasic/enableClassCourseTemplate',
    method: 'post',
    data: data
  })
}

// 修改班级课程基本
export function updateClassCourseBasic(data) {
  return request({
    url: '/basic/classCourseBasic',
    method: 'put',
    data: data
  })
}

// 删除班级课程基本
export function delClassCourseBasic(id) {
  return request({
    url: '/basic/classCourseBasic/' + id,
    method: 'delete'
  })
}
