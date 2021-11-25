import request from '@/utils/request'
// 添加上传图片
export function addImg(data) {
    return request({
        url: '/file/filetable',
        method: 'post',
        data: data
    })
}
// 删除上传图片
export function deleteImg(id) {
    return request({
        url: '/file/filetable/' + id,
        method: 'delete',
    })
}
/**
 * 文件表添加记录
 * @param data 通过拿到上传文件成功的回调res，将res再赋值给data，kzzd1是关联id，必填
 */
export function addFile(data) {
  return request({
    url: '/file/filetable',
    method: 'post',
    data: data
  })
}
// 根据文件表id删除记录
export function delFile(id) {
  return request({
    url: '/file/filetable/' + id,
    method: 'delete',
  })
}
// 查询文件表中的指定文件
export function selectFileList(data) {
    return request({
        url: '/file/filetable/list',
        method: 'get',
        params: data
    })
}

// 获取视频
export function getVideo(id) {
  return request({
    url: '/file/filetable/video/' + id,
    method: 'get'
  })
}
