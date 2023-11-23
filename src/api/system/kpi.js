import request from '@/utils/request'

// 查询绩效指标列表
export function listKpi(query) {
  return request({
    url: '/project/indicators/list',
    method: 'get',
    params: query,
  })
}
// 新增绩效指标
export function addKpi(data) {
  return request({
    url: '/project/indicators',
    method: 'post',
    data: data,
  })
}

// 修改绩效指标
export function updateKpi(data) {
  return request({
    url: '/project/indicators',
    method: 'put',
    data: data,
  })
}

// 删除绩效指标
export function deleteKpi(id) {
  return request({
    url: '/project/indicators/' + id,
    method: 'delete',
  })
}
