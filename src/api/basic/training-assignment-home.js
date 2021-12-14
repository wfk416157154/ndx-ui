import request from '@/utils/request'

// 培训分配主页面
export function trainAllocateHomePage(query) {
  return request({
    url: '/basic/allocate/trainAllocateHomePage',
    method: 'get',
    params: query
  })
}


// // 查询培训试卷成绩详细
// export function getTrainGrade(id) {
//   return request({
//     url: '/basic/trainGrade/' + id,
//     method: 'get'
//   })
// }

// // 新增培训试卷成绩
// export function addTrainGrade(data) {
//   return request({
//     url: '/basic/trainGrade',
//     method: 'post',
//     data: data
//   })
// }

// // 修改培训试卷成绩
// export function updateTrainGrade(data) {
//   return request({
//     url: '/basic/trainGrade',
//     method: 'put',
//     data: data
//   })
// }

// // 删除培训试卷成绩
// export function delTrainGrade(id) {
//   return request({
//     url: '/basic/trainGrade/' + id,
//     method: 'delete'
//   })
// }
