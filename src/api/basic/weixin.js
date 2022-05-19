import request from '@/utils/request'

// 查询微信用户表列表
export function wxUserList(query) {
    return request({
        url: '/basic/wxUser/list',
        method: 'get',
        params: query
    })
}


// 修改微信用户表
export function updateWxUser(data) {
    return request({
        url: '/basic/wxUser',
        method: 'put',
        data: data
    })
}

/**
 * 角色审核完成后发送消息给该微信用户
 * @param query
 */
export function checkRoleSendMsg(query) {
  return request({
    url: 'http://ndx-wxgzh-server.natapp1.cc/wxTemplateMessage/checkRoleSendMsg',
    method: 'get',
    params: query
  })
}
