import request from '@/utils/request'

// 查询生成教学计划列表
export function listGenerate(query) {
  return request({
    url: '/basic/teachingGenerate/list',
    method: 'get',
    params: query
  })
}

// 查询生成教学计划详细
export function getGenerate(id) {
  return request({
    url: '/basic/teachingGenerate/' + id,
    method: 'get'
  })
}

// 新增生成教学计划
export function addGenerate(data) {
  return request({
    url: '/basic/teachingGenerate',
    method: 'post',
    data: data
  })
}

// 修改生成教学计划
export function updateGenerate(data) {
  return request({
    url: '/basic/teachingGenerate',
    method: 'put',
    data: data
  })
}

// 删除生成教学计划
export function delGenerate(id) {
  return request({
    url: '/basic/teachingGenerate/' + id,
    method: 'delete'
  })
}

// 新增生成教学计划-跳过时间
export function addSkiptime(data) {
  return request({
    url: '/basic/skiptime',
    method: 'post',
    data: data
  })
}

// 修改生成教学计划-跳过时间
export function editSkiptime(data) {
  return request({
    url: '/basic/skiptime',
    method: 'put',
    data: data
  })
}

// 删除生成教学计划-跳过时间
export function deleteSkiptime(id) {
  return request({
    url: '/basic/skiptime/' + id,
    method: 'delete'
  })
}

// 新增生成教学计划-学期数据
export function addOrUpdateQueryTermList(data) {
  return request({
    url: '/basic/queryTerm/addOrUpdateDataList',
    method: 'post',
    data: data
  })
}

// 删除学期数据
export function deleteQueryTermData(id) {
  return request({
    url: '/basic/queryTerm/' + id,
    method: 'delete'
  })
}

// 查询生成教学计划-跳过时间列表
export function listSkiptime(query) {
  return request({
    url: '/basic/skiptime/list',
    method: 'get',
    params: query
  })
}

//添加或更新学期配置表的数据
export function saveOrUpdateTermsTeachingPlan(rybjid) {
  return request({
    url: '/basic/teachingGenerate/saveOrUpdateTermsTeachingPlan/'+rybjid,
    method: 'get',
  })
}


// 手动生成教学计划
export function generateTeachingHandle(data) {
  return request({
    url: '/basic/teachingGenerate/generateTeachingHandle',
    method: 'post',
    data: data
  })
}

// 查询教学计划(全部)
export function queryGenerateTeachingPlanData(data) {
  return request({
    url: '/basic/teachingGenerate/queryGenerateTeachingPlanData',
    method: 'post',
    data: data
  })
}

// 根据选择的时间范围调整教学计划
export function adjustTeachingPlan(data) {
  return request({
    url: '/basic/teachingGenerate/adjustTeachingPlan',
    method: 'post',
    data: data
  })
}

// 单独修改某一个课程的教学计划
export function aloneUpdateTeachingPlan(data) {
  return request({
    url: '/basic/teachingGenerate/aloneUpdateTeachingPlan',
    method: 'post',
    data: data
  })
}

// 设置教学计划进度
export function setJxjd(data) {
  return request({
    url: '/basic/planProgress/batchSavePlanProgress',
    method: 'post',
    data: data
  })
}


// 老师教学计划上半部
export function topHalfQuery(query) {
  return request({
    url: '/basic/teachingTeacher/topHalfQuery',
    method: 'get',
    params: query
  })
}

// 老师教学计划下半部
export function lowerHalf(query) {
  return request({
    url: '/basic/teachingTeacher/lowerHalf',
    method: 'get',
    params: query
  })
}
