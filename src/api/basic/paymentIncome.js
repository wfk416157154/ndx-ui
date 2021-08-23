import request from '@/utils/request'

// 查询缴费进账方式列表
export function listPaymentIncome(query) {
  return request({
    url: '/basic/paymentIncome/list',
    method: 'get',
    params: query
  })
}

// 查询缴费进账方式详细
export function getPaymentIncome(id) {
  return request({
    url: '/basic/paymentIncome/' + id,
    method: 'get'
  })
}

// 新增缴费进账方式
export function addPaymentIncome(data) {
  return request({
    url: '/basic/paymentIncome',
    method: 'post',
    data: data
  })
}

// 修改缴费进账方式
export function updatePaymentIncome(data) {
  return request({
    url: '/basic/paymentIncome',
    method: 'put',
    data: data
  })
}

// 删除缴费进账方式
export function delPaymentIncome(id) {
  return request({
    url: '/basic/paymentIncome/' + id,
    method: 'delete'
  })
}
