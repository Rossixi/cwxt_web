import request from '@/utils/request'

// 获取绩效指标表单
export function getTargetTable(query) {
  return request({
    url: '/project/indicators/getIndicatorsObject',
    method: 'get',
    params: query,
  })
}

// 根据专项名称获取树形结构
export function getTargetTree(query) {
  return request({
    url: '/project/indicators/getTree',
    method: 'get',
    params: query,
  })
}

// 根据专项名称获取三级下拉框
export function getThreeTarget(query) {
  return request({
    url: '/project/indicators/getThirdName',
    method: 'get',
    params: query,
  })
}
