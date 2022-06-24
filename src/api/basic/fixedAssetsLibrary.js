import request from '@/utils/request'

// 查询固定资产库列表
export function listGoodsLibrary(query) {
  return request({
    url: '/basic/goodsLibrary/list',
    method: 'get',
    params: query
  })
}

// 查询库存
export function getStock(query) {
  return request({
    url: '/basic/goodsLibrary/getStock',
    method: 'get',
    params: query
  })
}

// 查询库存历史记录
export function listBylibrary(query) {
  return request({
    url: '/basic/goodsLibrary/flowing/listBylibrary',
    method: 'get',
    params: query
  })
}

// 新增固定资产库
export function addGoodsLibrary(data) {
  return request({
    url: '/basic/goodsLibrary',
    method: 'post',
    data: data
  })
}
