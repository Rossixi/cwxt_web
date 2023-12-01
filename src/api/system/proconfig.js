import request from '@/utils/request'

// 获取项目配置
export function getProConfig(id) {
  return request({
    url: '/project/config/' + id,
    method: 'get',
  })
}

// 修改项目配置
export function updateProConfig(data) {
  return request({
    url: '/project/config',
    method: 'put',
    data: data,
  })
}
