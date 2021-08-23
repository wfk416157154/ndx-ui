import request from '@/utils/request'

// 查询缴费设置列表
export function listPaymentSetting(query) {
  return request({
    url: '/basic/paymentSetting/list',
    method: 'get',
    params: query
  })
}

// 查询缴费设置详细
export function getPaymentSetting(id) {
  return request({
    url: '/basic/paymentSetting/' + id,
    method: 'get'
  })
}

// 新增缴费设置
export function addPaymentSetting(data) {
  return request({
    url: '/basic/paymentSetting',
    method: 'post',
    data: data
  })
}

// 修改缴费设置
export function updatePaymentSetting(data) {
  return request({
    url: '/basic/paymentSetting',
    method: 'put',
    data: data
  })
}

// 删除缴费设置
export function delPaymentSetting(id) {
  return request({
    url: '/basic/paymentSetting/' + id,
    method: 'delete'
  })
}
