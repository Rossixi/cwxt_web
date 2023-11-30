import request from '@/utils/request'

// 获取项目列表
export function getManageList(data) {
  return request({
    url: '/project/manageList',
    method: 'post',
    data: data,
  })
}

// // 导出
// export async function exportManageList(data) {
//   // return request({
//   //   url: '/project/exportProList',
//   //   method: 'post',
//   //   data: data,
//   // })
//   await downManageFile('/project/exportProList', data)
// }
