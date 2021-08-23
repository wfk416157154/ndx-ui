import request from '@/utils/request'

// 查询缴费特殊情况列表
export function listPaymentSpecial(query) {
  return request({
    url: '/basic/paymentSpecial/list',
    method: 'get',
    params: query
  })
}

// 查询缴费特殊情况详细
export function getPaymentSpecial(id) {
  return request({
    url: '/basic/paymentSpecial/' + id,
    method: 'get'
  })
}

// 新增缴费特殊情况
export function addPaymentSpecial(data) {
  return request({
    url: '/basic/paymentSpecial',
    method: 'post',
    data: data
  })
}

// 修改缴费特殊情况
export function updatePaymentSpecial(data) {
  return request({
    url: '/basic/paymentSpecial',
    method: 'put',
    data: data
  })
}

// 删除缴费特殊情况
export function delPaymentSpecial(id) {
  return request({
    url: '/basic/paymentSpecial/' + id,
    method: 'delete'
  })
}
