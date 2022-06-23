import request from '@/utils/request'

export function listForAcdemicDean(query) {
    return request({
        url: '/basic/collegeEntranceExam/listForAcdemicDean',
        method: 'get',
        params: query
    })
}
export function listForTeacher(query) {
    return request({
        url: '/basic/collegeEntranceExam/listForTeacher',
        method: 'get',
        params: query
    })
}

// 查询高考成绩分数线列表
export function listCollegeScoreLine(query) {
    return request({
        url: '/basic/collegeScoreLine/list',
        method: 'get',
        params: query
    })
}

// 新增 高考成绩
export function addCollegeEntranceExam(data) {
    return request({
        url: '/basic/collegeEntranceExam',
        method: 'post',
        data: data
    })
}

// 批量新增或修改高考成绩分数线
export function addOrUpdate(data) {
    return request({
        url: '/basic/collegeScoreLine/addOrUpdate',
        method: 'post',
        data: data
    })
}
// 老师上传高考成绩后通知教务/提醒老师及时上传学生高考成绩
export function gkcjUploadInform(path, data) {
    return request({
        url: path + 'wxTemplateMessage/gkcjUploadInform',
        method: 'post',
        data: data
    })
}

// 编辑 高考成绩
export function updateCollegeEntranceExam(data) {
    return request({
        url: '/basic/collegeEntranceExam',
        method: 'put',
        data: data
    })
}

// 设置高考分数线
export function editClass(data) {
    return request({
        url: '/basic/bjclass/editClass',
        method: 'put',
        data: data
    })
}