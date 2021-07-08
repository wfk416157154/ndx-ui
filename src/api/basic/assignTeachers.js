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

// 关联 班级老师关联表
export function classAllotTeacher(data) {
  return request({
    url: '/basic/bjclass/classAllotTeacher',
    method: 'post',
    data: data
  })
}

// 查询 班级分配老师（不传查全部,0查未分配的班级,1查已分配的班级）
export function classAllotList(query) {
  return request({
    url: '/basic/bjclass/classAllotList',
    method: 'get',
    params: query
  })
}

