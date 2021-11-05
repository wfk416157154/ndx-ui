import request from '@/utils/request'

// 备课首页-老师备课树结构列表
export function treeListTeacher(query) {
  return request({
    url: '/basic/prepareLessons/treeListTeacher',
    method: 'get',
    params: query
  })
}

// 备课首页-备课首页-老师复习树结构
export function fxTreeListTeacher(query) {
  return request({
    url: '/basic//teachingReview/treeListTeacher',
    method: 'get',
    params: query
  })
}

// 获取备课的详细信息
export function prepareLessons(id) {
  return request({
    url: '/basic/prepareLessons/' + id,
    method: 'get'
  })
}

// 新增备课
export function addPrepareLessons(data) {
  return request({
    url: '/basic/prepareLessons',
    method: 'post',
    data : data
  })
}
