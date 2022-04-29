import request from '@/utils/request'

// 新增教参建议
export function addSuggest(data) {
    return request({
        url: '/basic/suggest',
        method: 'post',
        data: data
    })
}

// 修改教参建议
export function updateSuggest(data) {
    return request({
        url: '/basic/suggest',
        method: 'put',
        data: data
    })
}

// 查询老师考勤列表
export function listSuggest(query) {
    return request({
        url: '/basic/suggest/list',
        method: 'get',
        params: query
    })
}

// 查询教参列表
export function listReference(query) {
    return request({
        url: '/basic/reference/list',
        method: 'get',
        params: query
    })
}

// 新增教参
export function saveReference(data) {
    return request({
        url: '/basic/reference/saveReference',
        method: 'post',
        data: data
    })
}

// 教参记录
export function listRecord(query) {
    return request({
        url: '/basic/record/list',
        method: 'get',
        params: query
    })
}
// 启用教参 
export function enableReference(data) {
    return request({
        url: '/basic/reference/enableReference',
        method: 'post',
        data: data
    })
}
