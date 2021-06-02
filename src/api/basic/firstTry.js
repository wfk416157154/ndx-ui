import request from '@/utils/request'

// // 查询学生每次考试的成绩列表
export function getItem(query) {
  return request({
    url: '/basic/teacherPersonnel/list',
    method: 'get',
    params: query
  })
}

// 新增老师信息
export function teacherPersonnel(data) {
  return request({
    url: '/basic/teacherPersonnel',
    method: 'post',
    data: data
  })
}

// 修改老师人事信息
export function editTeacherPersonnel(data) {
  return request({
    url: '/basic/teacherPersonnel',
    method: 'put',
    data: data
  })
}

// 查询老师证件基本信息详细
export function getInfoByKzzd2(kzzd2) {
  return request({
    url: '/basic/teacher/getInfoByTeacherPersonnelId/' + kzzd2,
    method: 'get'
  })
}
