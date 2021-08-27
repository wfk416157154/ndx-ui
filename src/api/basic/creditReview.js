import request from '@/utils/request'

// 减免审核列表
export function exemptAuditQuery(query) {
  return request({
    url: '/basic/paymentSpecial/exemptAuditListQuery',
    method: 'get',
    params: query
  })
}

// 减免审核列表
export function paymentSpecial(data) {
  return request({
    url: '/basic/paymentSpecial',
    method: 'put',
    data: data
  })
}