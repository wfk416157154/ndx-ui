import request from '@/utils/request'

// 查询消息接收人列表
export function listWxMsgUser(path, query) {
    return request({
        url: path + 'msgUser/list',
        method: 'get',
        params: query
    })
}
// 获取消息接收人的详细信息
export function getWxMsgUser(Ppath, id) {
    return request({
        url: path + 'msgUser/' + id,
        method: 'get'
    })
}

// 新增消息接收人
export function addWxMsgUser(path, data) {
    return request({
        url: path + 'wxMaterial',
        method: 'post',
        data: data
    })
}

// 接受者
export function getUserList(path, data) {
    return request({
        url: path + 'weChar/getUserList',
        method: 'post',
        data: data
    })
}


// 修改消息接收人
export function updateWxMsgUser(path, data) {
    return request({
        url: path + 'msgUser',
        method: 'put',
        data: data
    })
}

// 删除消息接收人
export function delWxMsgUser(path, id) {
    return request({
        url: path + 'msgUser/' + id,
        method: 'delete'
    })
}
