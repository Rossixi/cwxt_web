import request from '@/utils/request'

// 获取项目列表
export function getSelfAssessment(query) {
  return request({
    url: '/project/selfassessment/list',
    method: 'get',
    params: query,
  })
}
