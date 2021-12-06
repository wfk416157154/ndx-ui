import request from '@/utils/request'

// 查询培训课程关联视频列表
export function listCurriculumVideo(query) {
  return request({
    url: '/basic/curriculumVideo/list',
    method: 'get',
    params: query
  })
}

// 查询培训课程关联视频详细
export function getCurriculumVideo(id) {
  return request({
    url: '/basic/curriculumVideo/' + id,
    method: 'get'
  })
}

// 新增培训课程关联视频
export function addCurriculumVideo(data) {
  return request({
    url: '/basic/curriculumVideo',
    method: 'post',
    data: data
  })
}

// 修改培训课程关联视频
export function updateCurriculumVideo(data) {
  return request({
    url: '/basic/curriculumVideo',
    method: 'put',
    data: data
  })
}

// 删除培训课程关联视频
export function delCurriculumVideo(id) {
  return request({
    url: '/basic/curriculumVideo/' + id,
    method: 'delete'
  })
}
