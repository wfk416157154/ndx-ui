import request from '@/utils/request'

// 统计班级每次考试成绩
export function listClassGrade(query) {
    return request({
        url: '/basic/everytime/classGradeInfoQuery',
        method: 'get',
        params: query
    })
}

