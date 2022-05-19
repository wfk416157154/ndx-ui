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

// 新增 高考成绩
export function addCollegeEntranceExam(data) {
    return request({
        url: '/basic/collegeEntranceExam',
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