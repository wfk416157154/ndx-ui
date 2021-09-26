import request from '@/utils/request'

// 查询备课列表
export function listPrepareLessons(query) {
  return request({
    url: '/basic/prepareLessons/list',
    method: 'get',
    params: query
  })
}

// 查询备课详细
export function getPrepareLessons(id) {
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
    data: data
  })
}

// 修改备课
export function updatePrepareLessons(data) {
  return request({
    url: '/basic/prepareLessons',
    method: 'put',
    data: data
  })
}

// 删除备课
export function delPrepareLessons(id) {
  return request({
    url: '/basic/prepareLessons/' + id,
    method: 'delete'
  })
}

//  教务备课列表
export function listAcdemicDean(query) {
  return request({
    url: '/basic/prepareLessons/listAcdemicDean',
    method: 'get',
    params: query
  })
}
