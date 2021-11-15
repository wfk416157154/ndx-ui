import request from '@/utils/request'

// 教务备课列表 (老师,教务角色)
export function listAcdemicDean(query) {
  return request({
    url: '/basic/prepareLessons/listAcdemicDean',
    method: 'get',
    params: query
  })
}


// 获取备课的详细信息
export function prepareLessonsDetails(id) {
  return request({
    url: '/basic/prepareLessons/' + id,
    method: 'get'
  })
}

// 分配人(根据组长姓名获取下级组长id集)
export function getSubLeaderIds(query) {
  return request({
    url: '/basic/prepareLessons/getSubLeaderIds',
    method: 'get',
    params: query
  })
}

// 备课督导数据展示
export function prepareSupervisorData(query) {
  return request({
    url: '/basic/prepareLessons/prepareSupervisorData',
    method: 'get',
    params: query
  })
}

// 修改备课
export function editPrepareLessons(data) {
  return request({
    url: '/basic/prepareLessons',
    method: 'put',
    data: data
  })
}
