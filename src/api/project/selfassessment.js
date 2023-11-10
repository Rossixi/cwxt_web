import request from '@/utils/request'

// 获取项目列表
export function getSelfAssessment(query) {
  return request({
    url: '/project/selfassessment/list',
    method: 'get',
    params: query,
  })
}

// 获取代办/已办列表
export function getPersonalMatters(query) {
  return request({
    url: '/project/personal/matters',
    method: 'get',
    params: query,
  })
}
