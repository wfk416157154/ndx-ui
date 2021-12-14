import request from '@/utils/request'

// 入职培训分配页面
export function entryAllocateList(query) {
  return request({
    url: '/basic/allocate/entryAllocateList',
    method: 'get',
    params: query
  })
}

// 培训分配
export function trainAllocate(data) {
  return request({
    url: '/basic/allocate/trainAllocate',
    method: 'post',
    data: data
  })
}

// 试卷分组查询
export function paperGroupQuery(query) {
  return request({
    url: '/basic/allocate/paperGroupQuery',
    method: 'get',
    params: query
  })
}

//  培训分配详情查看
export function getTrainAllocateDetailQuery(id) {
  return request({
    url: '/basic/allocate/trainAllocateDetailQuery/' + id,
    method: 'get'
  })
}

