import request from '@/utils/request'

// 查询报销列表
export function listExpense(query) {
  return request({
    url: '/basic/expense/list',
    method: 'get',
    params: query
  })
}

// 查询报销流程列表
export function listExpenseProcess(query) {
  return request({
    url: '/basic/expenseProcess/list',
    method: 'get',
    params: query
  })
}

// 查询区域负责人列表
export function listAreaManager(query) {
  return request({
    url: '/basic/areaManager/list',
    method: 'get',
    params: query
  })
}

// 获取报销的详细信息
export function getListExpense(id) {
  return request({
    url: '/basic/expense/' + id,
    method: 'get'
  })
}

// 金额转为中文形式
export function digitToChinese(id) {
  return request({
    url: '/basic/expense/digitToChinese/' + id,
    method: 'get'
  })
}

// 区域负责人
export function getClassInfo(id) {
  return request({
    url: '/basic/bjclass/getClassInfo/' + id,
    method: 'get'
  })
}

// 新增报销
export function addExpense(data) {
  return request({
    url: '/basic/expense',
    method: 'post',
    data: data
  })
}

// 审核
export function expenseAudit(data) {
  return request({
    url: '/basic/expense/audit',
    method: 'post',
    data: data
  })
}

// 导出报销
export function expenseExport(data) {
  return request({
    url: '/basic/expense/export',
    method: 'post',
    data: data
  })
}

// 老师修改材料
export function teacherEdit(data) {
  return request({
    url: '/basic/expense/teacherEdit',
    method: 'post',
    data: data
  })
}

// 修改报销
export function editExpense(data) {
  return request({
    url: '/basic/expense',
    method: 'put',
    data: data
  })
}

// 结算
export function settleAccount(data) {
  return request({
    url: '/basic/expense/settleAccount',
    method: 'put',
    data: data
  })
}

// 删除报销
export function delExpense(id) {
  return request({
    url: '/basic/expense/' + id,
    method: 'delete'
  })
}
