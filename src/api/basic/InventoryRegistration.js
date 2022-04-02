import request from '@/utils/request'

// 新增书籍
export function addBook(data) {
    return request({
        url: '/basic/book',
        method: 'post',
        data: data
    })
}

// 修改书籍
export function updateBook(data) {
    return request({
        url: '/basic/book',
        method: 'put',
        data: data
    })
}

// 查询书籍列表
export function listBook(query) {
    return request({
        url: '/basic/book/list',
        method: 'get',
        params: query
    })
}

// 查询书籍登记明细列表
export function listRegisterDetail(query) {
    return request({
        url: '/basic/registerDetail/list',
        method: 'get',
        params: query
    })
}

// 获取书籍的详细信息 book
export function bookDetalis(bjid) {
    return request({
        url: '/basic/book/' + bjid,
        method: 'get'
    })
}
