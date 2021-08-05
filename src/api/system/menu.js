import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: query
  })
}

// 查询某菜单下的按钮功能权限
export function findMenuPermissionByMenuId(query) {
  return request({
    url: '/system/menu/findMenuPermissionByMenuId',
    method: 'get',
    params: query
  })
}

// 查询所有的权限方法
export function listAllPreAuthorizeMethods(query) {
  return request({
    url: '/system/menu/listAllRequestMappingPreAuthorizeMethods',
    method: 'get',
    params: query
  })
}

// 刷新缓存
export function refreshCache(query) {
  return request({
    url: '/system/menu/refreshCache',
    method: 'get',
    params: query
  })
}



// 菜单-添加按钮功能
export function menuAddPermission(data) {
  return request({
    url: '/system/menu/menuAddPermission',
    method: 'post',
    data: data
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}

// 查询菜单所对应的角色
export function selectMenuRoleList(query) {
  return request({
    url: '/system/menu/selectMenuRoleList',
    method: 'get',
    params: query
  })
}

