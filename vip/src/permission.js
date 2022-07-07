// 权限校验 vue router中的前置钩子函数 beforeeach（to,from,next)
//当进行路由跳转之前，进行判断是否已经登陆过，登陆过则允许访问非登陆页面，否则回到登陆页
//to 即将要进入的目标路由对象
//from 即将要离开的路由对象
//next:是一个方法，可以指定路由地址，进行路由跳转
import router from './router'
import {getUserInfo} from './api/login'
router.beforeEach((to,from,next)=>{
    //1.获取token
    const token=localStorage.getItem('token')
    //1.1如果没有获取到token，要访问非登陆页，则不允许访问,回到登陆页面 /login
    if(!token){
        if(to.path !='/login'){
            next({path:'/login'})
        }else{
            //请求登陆页 /login
            next()
        }
    }else{
        //1.2获取到token，
      //1.2.1 请求路由/login，那就去目标路由
      if(to.path==='/login'){
          next()
      }else{
          //1.2.2 请求路由非登陆页面，现在本地查看是否有用户信息，
          const userInfo=localStorage.getItem('user')
          if(userInfo){
              //如果本地没有用户信息，就通过token去获取用户信息
              next()
          }else{
              getUserInfo(token).then(response=>{
                  const resp=response.data
                  if(resp.flag){
                       //如果获取到用户信息，则进行非登陆页面，否则回到登陆页面
                       //保存到本地
                       localStorage.setItem('user',JSON.stringify(resp.data))
                       next()
                  }else{
                      //未获取到用户信息，重新登陆
                      next({path:'/login'})
                  }
              })
          }
          
          
      }


    }
    
 
})