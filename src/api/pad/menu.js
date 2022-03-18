import request from '@/utils/request'

// 查询pad菜单权限列表
export function listMenu(query) {
  return request({
    url: '/pad/menu/list',
    method: 'get',
    params: query
  })
}

// 查询pad菜单权限详细
export function getMenu(menuId) {
  return request({
    url: '/pad/menu/' + menuId,
    method: 'get'
  })
}

// 新增pad菜单权限
export function addMenu(data) {
  return request({
    url: '/pad/menu',
    method: 'post',
    data: data
  })
}

// 修改pad菜单权限
export function updateMenu(data) {
  return request({
    url: '/pad/menu',
    method: 'put',
    data: data
  })
}

// 删除pad菜单权限
export function delMenu(menuId) {
  return request({
    url: '/pad/menu/' + menuId,
    method: 'delete'
  })
}
