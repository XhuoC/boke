<template>
    <div class="header">
        <a href="#/">
        <img  class="logo" src="https://file.xdclass.net/xdclass/xdclass_logo.png" width="25px" alt="">
        <span class="company">会员管理系统</span>
        </a>

       <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link">
    {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
    <el-dropdown-item icon="el-icon-s-fold" command="b">退出系统</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>

 
  <!-- 修改密码 -->
  
<el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="width:300px">
  <el-form-item label="原密码" prop="oldPass">
    <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="新密码" prop="pass">
    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
  </el-form-item>
</el-form>
</el-dialog>
    </div>

</template>

<script>
import {logout} from '@/api/login'
import passwordApi from '@/api/password'
export default{
    data(){
        //在return上面进行申明自定校验
        const validateOldPass=(rule,value,callback)=>{
            passwordApi.checkPwd(this.user.id.value).then(response=>{
                const resp=response.data
                if(resp.flag){
                    //验证通过
                    callback()
                }else{
                    callback(new Error(resp.message))
                }
            })

        }
        //校验新密码是否一致
        const validatePass=(rule,value,callback)=>{
            //value代码checkpass
            if(value !== this.ruleForm.pass){
                callback(new Error('两次输入的密码不一致'))
            }else{
                //相同通过
                callback()
            }

        }



        return {
            user:JSON.parse(localStorage.getItem('user')),
            dialogFormVisible:false,
            ruleForm:{
                oldPass:'',
                pass:'',
                checkPass:''
            },
            rules:{
            oldPass:[{required:true,message:'原密码不能为空',trigger:"blur"},
            {validator:validateOldPass,trigger:'blur'}],
            pass:[{required:true,message:'新密码不能为空',trigger:"blur"}],
            checkPass:[{required:true,message:'确认密码不能为空',trigger:"blur"},
            {validator:validatePass,trigger:'change'}],

            },
        }
    },
    methods:{
        handleCommand(command){
            // this.$message(`点击了${command}`)
            switch(command){
                case 'a':
                    //修改密码
                   // this.$message(`点击修改密码`)
                   //打开修改密码窗口
                   this.handlePwd()
                    break;
                case 'b':
                    this.handleLogout()
                    //退出系统
                    //this.$message(`退出系统`)
                    // const token=localStorage.getItem("token");
                    // logout(token).then(response=>{
                    //     const resp=response.data
                    //     if(resp.flag){
                    //         //退出成功
                    //         //清除本地数据
                    //         localStorage.removeItem('token')
                    //         localStorage.removeItem('user')
                    //         //回到登陆界面
                    //         this.$router.push('/login')

                    //     }else{
                    //         this.$message({
                    //             massage:'resp.message',
                    //             type:'warning',
                    //             duration:500 //弹出停留时间
                    //         });
                    //     }
                    // })
                    break;
                default:
                    break;
            }
        },
        handleLogout(){
             const token=localStorage.getItem("token");
                    logout(token).then(response=>{
                        const resp=response.data
                        if(resp.flag){
                            //退出成功
                            //清除本地数据
                            localStorage.removeItem('token')
                            localStorage.removeItem('user')
                            //回到登陆界面
                            this.$router.push('/login')

                        }else{
                            this.$message({
                                massage:'resp.message',
                                type:'warning',
                                duration:500 //弹出停留时间
                            });
                        }
                    })
        },
        //打开修改密码窗口
        handlePwd(){
            this.dialogFormVisible=true
            this.$nextTick(()=>{
                this.$refs['ruleForm'].resetFields()
            })
        },
        //修改密码
        submitForm(formName){
            this.$refs[formName].validate(valid=>{
                if(valid){
                    console.log("校验成功")
                    passwordApi.updatePwd(this.user.id,this.ruleForm.checkPass).then(response=>{
                        const resp=response.data
                        //不管失败还是成功，进行提醒
                        this.$message({
                            message:resp.message,
                            type:resp.flag?'success':'warning'
                        })
                        if(resp.flag){
                            //更新成功，退出 回到登陆页面
                            this.handleLogout()
                            //关闭窗口
                            this.dialogFormVisible=false                        
                        }
                    })

                }else{
                    return false
                }

            })

        }
    }
}
</script>

<style scoped>
.logo{
    vertical-align: middle;
    padding:0px 10px 0px 40px;
}
.company{
    position: absolute;
    color:white
}

/* 下拉菜单 */
.el-dropdown{
    float: right;
    margin-right: 40px;
}
.el-dropdown-link{
    color:white;
}

</style>