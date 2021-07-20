import request from '@/utils/request'

// 查询班级课程列表
export function listClassCourse(query) {
  return request({
    url: '/basic/classCourse/list',
    method: 'get',
    params: query
  })
}

// 查询班级课程详细
export function getClassCourse(id) {
  return request({
    url: '/basic/classCourse/' + id,
    method: 'get'
  })
}

// 同日语班的原班级信息查询
export function ybjQuery(bjid) {
  return request({
    url: '/basic/bjclass/ybjQuery/' + bjid,
    method: 'get'
  })
}

// 新增班级课程
export function addClassCourse(data) {
  return request({
    url: '/basic/classCourse',
    method: 'post',
    data: data
  })
}

// 新增班级课程
export function classCourseBasicSave(data) {
  return request({
    url: '/basic/classCourseBasic/save',
    method: 'post',
    data: data
  })
}

// 保存课表集合
export function saveList(data) {
  return request({
    url: '/basic/classCourse/saveList',
    method: 'post',
    data: data
  })
}

// 修改班级课程
export function updateClassCourse(data) {
  return request({
    url: '/basic/classCourse',
    method: 'put',
    data: data
  })
}

// 删除班级课程
export function delClassCourse(id) {
  return request({
    url: '/basic/classCourse/' + id,
    method: 'delete'
  })
}
