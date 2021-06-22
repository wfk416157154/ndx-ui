import request from '@/utils/request'

// 查询班级基础信息和班级学生每次考试的平均成绩列表
export function listClassGrade(query) {
    return request({
        url: '/basic/bjclass/listClassGrade',
        method: 'get',
        params: query
    })
}

// 获取班级平均成绩的动态列名
export function getColumnNameList(query) {
    return request({
        url: '/basic/bjclass/getColumnNameList',
        method: 'get',
        params: query
    })
}

// 查询班级每次考试平均成绩动态列名的数据
export function getListAll(query) {
    return request({
        url: '/basic/bjclass/listAll',
        method: 'get',
        params: query
    })
}

// 获取某个班级某次考试的成绩信息
export function getBjClassStugradeInfo(query) {
    return request({
        url: '/basic/bjclass/getBjClassStugradeInfo',
        method: 'get',
        params: query
    })
}
