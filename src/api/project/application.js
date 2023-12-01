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

// 删除上传文件
export function deleteFile(data) {
  return request({
    url: '/project/file/DelFile',
    method: 'delete',
    data: data,
  })
}

// 提交接口
export function submitProject(data) {
  return request({
    url: '/project/application',
    method: 'post',
    data: data,
  })
}

// 获取审批人员数据
export function getReviewer() {
  return request({
    url: '/project/GetReviewer',
    method: 'get',
  })
}

// 获取专项名称数据
export function getSpecialName() {
  return request({
    url: '/project/indicators/getSpecialName',
    method: 'get',
  })
}

// 获取配置说明
export function getAssetIllustrate() {
  return request({
    url: '/project/config/GetProConfigIllustrate',
    method: 'get',
  })
}
