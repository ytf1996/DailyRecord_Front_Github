import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import  QS from 'qs' 
import { showLoading, hideLoading } from '@/utils/loading';
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000*30, // request timeout
  headers: {
    'Content-type':'application/x-www-form-urlencoded'
  },
})

// request interceptor
service.interceptors.request.use( 
  config => {
    // do something before request is sent
    showLoading();
    if (store.getters.token) {
      // let each request carry token 
      // please modify it according to the actual situation
      config.headers['accessToken'] = getToken()
    } 
    if(config.headers['Content-type'] =='application/x-www-form-urlencoded' )
    {  
      config.data = QS.stringify(config.data); 
    }
    return config
  },
  error => { 
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => { 
    const res = response.data
    hideLoading(); 
    // if the custom code is not 20000, it is judged as an error.
    if (res.result !== "success") { 
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      }) ;
      return res;
    } else {
      return res;
    }
  },
  error => {
    debugger
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
