import request from '@/utils/request'

// 查询缴费班级列表
export function paymentClassPageQuery(query) {
  return request({
    url: '/basic/paymentFinancial/paymentClassPageQuery',
    method: 'get',
    params: query
  })
}
