import request from '@/utils/request'

// 添加上传文件
export function addImg(data) {
    return request({
        url: '/file/filetable',
        method: 'post',
        data: data
    })
}
// 删除上传文件
export function deleteImg(id) {
    return request({
        url: '/file/filetable/' + id,
        method: 'delete',
    })
}
// 查询指定文件
export function selectFileList(data) {
    return request({
        url: '/file/filetable/list',
        method: 'get',
        params: data
    })
}