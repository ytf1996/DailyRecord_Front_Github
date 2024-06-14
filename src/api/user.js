import request from '@/utils/request'

export function login(dt) {
  return request({
    url: '/DailyRecord/DailyRecordBase/LogInDailyRecord',
    method: 'post',
    // data:`jobNumber=${dt.username}&Password=${dt.password}`
    data:{
      jobNumber: dt.username,
      Password: dt.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
