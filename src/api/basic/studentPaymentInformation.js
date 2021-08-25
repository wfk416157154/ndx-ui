import request from '@/utils/request'

// 查询学生缴费列表数据
export function paymentStudent(query) {
  return request({
    url: '/basic/paymentStudent/list',
    method: 'get',
    params: query
  })
}

// 查询学生缴费列表-动态列名
export function paymentStudentColumnNamelist(query) {
  return request({
    url: '/basic/paymentStudent/columnNamelist',
    method: 'get',
    params: query
  })
}

// 学生缴费（包含批量缴费）
export function addBatchStuPayment(data) {
  return request({
    url: '/basic/paymentStudent/addBatchStuPayment',
    method: 'post',
    data: data
  })
}