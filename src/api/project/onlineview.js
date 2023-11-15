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

// 获取历史项目详细信息
export function getHistoryProDetail(gid) {
  return request({
    url: '/project/gethistoryinfo/' + gid,
    method: 'get',
  })
}

// 提交审核意见
export function approvalSubmit(data) {
  return request({
    url: '/project/approval',
    method: 'post',
    data: data,
  })
}

// 修改项目信息
export function editProject(data) {
  return request({
    url: '/project/Edit',
    method: 'put',
    data: data,
  })
}
