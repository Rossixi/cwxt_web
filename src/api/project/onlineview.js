import request from '@/utils/request'

// 获取项目列表
export function getProList(query) {
  return request({
    url: '/project/list',
    method: 'get',
    params: query,
  })
}

// 获取项目详细信息
export function getProDetail(gid) {
  return request({
    url: '/project/getinfo/' + gid,
    method: 'get',
  })
}
