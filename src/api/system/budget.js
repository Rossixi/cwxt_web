import request from '@/utils/request'

// 查询分类列表
export function listBudget(query) {
  return request({
    url: '/system/SysEconomic/treeList',
    method: 'get',
    params: query,
  })
}

// 获取一级分类
export function firstBudget() {
  return request({
    url: '/system/SysEconomic/getFirst',
    method: 'get',
  })
}

// 新增分类
export function addConomic(data) {
  return request({
    url: '/system/SysEconomic',
    method: 'post',
    data: data,
  })
}

// 修改分类
export function updateConomic(data) {
  return request({
    url: '/system/SysEconomic',
    method: 'put',
    data: data,
  })
}

// 删除分类
export function deleteConomic(id) {
  return request({
    url: '/system/SysEconomic/' + id,
    method: 'delete',
  })
}
