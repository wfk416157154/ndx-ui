import request from '@/utils/request'

// 查询缴费审核列表数据
export function queryStuTeacherChecklist(query) {
  return request({
    url: '/basic/paymentStudent/queryStuTeacherChecklist',
    method: 'get',
    params: query
  })
}

// 审核学生缴费数据
export function checkStuPayment(query) {
  return request({
    url: '/basic/paymentStudent/checkStuPayment',
    method: 'get',
    params: query
  })
}