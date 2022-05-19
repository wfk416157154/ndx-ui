import request from '@/utils/request'

// 查询教参分配主页
export function templateAllotList(query) {
    return request({
        url: '/system/userTemplate/templateAllotList',
        method: 'get',
        params: query
    })
}
// 查询教参分配主页教材
export function unallocatedList(query) {
    return request({
        url: '/basic/teachingTemplate/unallocatedList',
        method: 'get',
        params: query
    })
}

// 分配
export function templateAllot(data) {
    return request({
        url: '/system/userTemplate/templateAllot',
        method: 'post',
        data: data
    })
}

