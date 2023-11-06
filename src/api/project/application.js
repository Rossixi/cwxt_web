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
