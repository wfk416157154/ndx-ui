import request from '@/utils/request'

// 课件主页面的查询
export function queryKjTreeList(query) {
  return request({
    url: '/basic/teachingTemplate/queryTreeList',
    method: 'get',
    params: query
  })
}

// 教学计划模板的查询
export function queryTeachingTemplateList(query) {
  return request({
    url: '/basic/teachingTemplate/list',
    method: 'get',
    params: query
  })
}

