import request from '@/utils/request'

// 查询培训学习记录列表
export function learnRecordList(query) {
  return request({
    url: '/basic/learnRecord/list',
    method: 'get',
    params: query
  })
}

// 查询视频测试题列表
export function videoQuestionList(query) {
  return request({
    url: '/basic/videoQuestion/list',
    method: 'get',
    params: query
  })
}

// // 查询培训内容记录详细
// export function getTrainContentRecord(id) {
//   return request({
//     url: '/basic/trainContentRecord/' + id,
//     method: 'get'
//   })
// }

// 新增培训学习记录
export function addLearnRecord(data) {
  return request({
    url: '/basic/learnRecord',
    method: 'post',
    data: data
  })
}


// 修改培训学习记录
export function updateLearnRecord(data) {
  return request({
    url: '/basic/learnRecord',
    method: 'put',
    data: data
  })
}

// // 删除培训内容记录
// export function delTrainContentRecord(id) {
//   return request({
//     url: '/basic/trainContentRecord/' + id,
//     method: 'delete'
//   })
// }
