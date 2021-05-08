import request from '@/utils/request'

// 上传文件
export function addImg(data) {
    return request({
        url: '/file/filetable',
        method: 'post',
        data: data
    })
}