import request from '@/utils/request'

// 查询老师信息列表
export function teacherList(query) {
  return request({
    url: '/basic/teacher/list',
    method: 'get',
    params: query
  })
}

// 更新班级信息表的老师信息
export function editBjclass(data) {
  return request({
    url: '/basic/bjclass',
    method: 'put',
    data: data
  })
}