
import request from '@/utils/request'

// 查询督导班级信息
export function supervisorClassInfo(query) {
  return request({
    url: '/basic/supervisor/supervisorClassInfo',
    method: 'get',
    params: query
  })
}
