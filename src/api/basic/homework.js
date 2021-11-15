import request from '@/utils/request'

// 查询作业日志列表
export function listHomework(query) {
  return request({
    url: '/basic/homework/list',
    method: 'get',
    params: query
  })
}

// 查询作业日志详细
export function getHomework(id) {
  return request({
    url: '/basic/homework/' + id,
    method: 'get'
  })
}

// 新增作业日志
export function addHomework(data) {
  return request({
    url: '/basic/homework',
    method: 'post',
    data: data
  })
}

// 修改作业日志
export function updateHomework(data) {
  return request({
    url: '/basic/homework',
    method: 'put',
    data: data
  })
}

// 删除作业日志
export function delHomework(id) {
  return request({
    url: '/basic/homework/' + id,
    method: 'delete'
  })
}


// 查询学生-作业日志列表
export function listHomeworkLogStudent(query) {
  return request({
    url: '/basic/homeworkLogStudent/list',
    method: 'get',
    params: query
  })
}

// 查询学生-作业日志详细
export function getHomeworkLogStudent(id) {
  return request({
    url: '/basic/homeworkLogStudent/' + id,
    method: 'get'
  })
}

// 新增学生-作业日志
export function addHomeworkLogStudent(data) {
  return request({
    url: '/basic/homeworkLogStudent',
    method: 'post',
    data: data
  })
}

// 修改学生-作业日志
export function updateHomeworkLogStudent(data) {
  return request({
    url: '/basic/homeworkLogStudent',
    method: 'put',
    data: data
  })
}

// 删除学生-作业日志
export function delHomeworkLogStudent(id) {
  return request({
    url: '/basic/homeworkLogStudent/' + id,
    method: 'delete'
  })
}
