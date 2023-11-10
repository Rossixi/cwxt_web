import request from '@/utils/request'

// 获取项目列表
export function getManageList(query) {
  return request({
    url: '/project/list',
    method: 'get',
    params: query,
  })
}
