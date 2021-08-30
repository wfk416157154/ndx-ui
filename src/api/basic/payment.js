import request from '@/utils/request'

// 查询单个学生缴费详情数据
export function queryStuPaymentDetail(query) {
  return request({
    url: '/basic/paymentStudent/queryStuPaymentDetail',
    method: 'get',
    params: query
  })
}