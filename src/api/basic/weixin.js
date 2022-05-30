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
export function checkRoleSendMsg(wechatServerUrl,query) {
  return request({
    url: wechatServerUrl+'wxTemplateMessage/checkRoleSendMsg',
    method: 'get',
    params: query
  })
}

/**
 * 消息提醒
 */
 export function messageReminder(wechatServerUrl,data) {
  return request({
    url: wechatServerUrl+'wxTemplateMessage/gkcjUploadInform',
    method: 'post',
    data: data
  })
}

// 成绩上传统计提醒
export function gradeUploadInform(wechatServerUrl,data) {
  return request({
    url: wechatServerUrl+'wxTemplateMessage/gradeUploadInform',
    method: 'post',
    data: data
  })
}
