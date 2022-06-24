import request from '@/utils/request'

// 查询固定资产登记列表
export function listGoodsRegister(query) {
  return request({
    url: '/basic/goodsLibrary/register/list',
    method: 'get',
    params: query
  })
}

// 新增固定资产库登记
export function addGoodsLibraryRegister(data) {
  return request({
    url: '/basic/goodsLibrary/register',
    method: 'post',
    data: data
  })
}

// 修改固定资产库登记
export function updateRegister(data) {
  return request({
    url: '/basic/goodsLibrary/register',
    method: 'put',
    data: data
  })
}
