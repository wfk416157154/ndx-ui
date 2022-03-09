import request from '@/utils/request'

// 新增邮寄
export function addPost(data) {
    return request({
        url: '/basic/post',
        method: 'post',
        data: data
    })
}

// 查询邮寄列表
export function checkPostList(query) {
    return request({
        url: '/basic/post/list',
        method: 'get',
        params: query,
    })
}

// 修改邮寄
export function updatePost(data) {
    return request({
        url: '/basic/post',
        method: 'put',
        data: data
    })
}

// 导出邮寄信息
export function exportPost(data) {
    return request({
        url: '/basic/post/export',
        method: 'post',
        data: data
    })
}

// 导入邮寄信息  /post/importData
export function importPost(data) {
    return request({
        url: '/basic/post/importData',
        method: 'post',
        data: data
    })
}

// 下载邮寄导入数据   /post/importTemplate
export function importTemplate(data) {
    return request({
        url: '/basic/post/importTemplate',
        method: 'post',
        data: data
    })
}

// 删除邮寄  /post/{ids}
export function delPost(id) {
    return request({
        url: '/basic/post/' + id,
        method: 'delete'
    })
}

//  邮寄详情 /post/{id}
export function postDetails(id) {
    return request({
        url: '/basic/post/' + id,
        method: 'get',
    })
}