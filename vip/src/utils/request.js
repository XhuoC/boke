import axios from 'axios'
import { Loading,Message } from 'element-ui';



const loading={
  loadingInstance:null,//loading实例
  //打开加载
  open:function(){
    if(this.loadingInstance ===null){
      //如果实例为空，则创建
      loadingInstance=Loading.service({
        target:'.main',
        text:'拼命加载中...',
        background:'rgba(0,0,0,0.5)'
    });

    }
    


  },
  //关闭加载
  close:function(){
    //不为空是，则关闭加载窗口
    if(this.loadingInstance !== null){
      loadingInstance.close()
    }
    this.loadingInstance=null
   
  }
}




// axios.get('/db.json').then(response=>{
//     const data=response.data
//     console.log(data)
// })

const request=axios.create({
  //db.json>通过 axios》/dev-api/db.json>通过代理转发（vue.config.js）》http://localhost:8001/db.json
    //baseURL:'/dev-api',
    // baseURL:'/',
    baseURL:process.env.VUE_APP_BASE_API,
    timeout:5000 //请求超时，5000毫秒
})
// request.get('/db.json').then(response=>{
//         const data=response.data
//         console.log(data)
//     })

// Add a request interceptor 请求拦截器
request.interceptors.request.use(function (config) {
    // 请求拦截
    //打开加载窗口
    loading.open
    return config;
  }, function (error) {
    // 出现异常
    loading.close()
    return Promise.reject(error);
  });

// Add a response interceptor 响应拦截器
request.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    loading.close()
    const resp=response.data
    //后台正常响应的状态，如果不是2000，说明后台处理有问题
    if(resp.code !==2000){
      Message({
        message:resp.message||'系统异常',
        type:'warning',
        duration:5*1000
      })
    }
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    loading.close()
    console.log('response.error',error.response.status)
    Message({
      message:error.message,
      type:'error',
      duration:5*1000
    })
    return Promise.reject(error);
  });


export default request //到处自定义创建的 axios 对象

