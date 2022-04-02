import request from '@/utils/request'

// 新增书籍登记
export function addRegister(data) {
    return request({
        url: '/basic/register',
        method: 'post',
        data: data
    })
}

// 修改书籍登记
export function updateRegister(data) {
    return request({
        url: '/basic/register',
        method: 'put',
        data: data
    })
}

// 查询书籍登记列表
export function listRegister(query) {
    return request({
        url: '/basic/register/list',
        method: 'get',
        params: query
    })
}

// 详情
export function registerDetalis(id) {
    return request({
        url: '/basic/register/' + id,
        method: 'get'
    })
}
