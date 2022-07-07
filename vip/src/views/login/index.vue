<template>
  <div class="login-container">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
      class="login-form"
    >
      <h2 class="login-title">会员管理系统</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login, getUserInfo } from "@/api/login";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        //console.log(valid)
        if (valid) {
          //提交表单验证是否正确
          login(this.form.username, this.form.password).then((response) => {
            const resp = response.data;
            console.log(resp, resp.flag);
            if (resp.flag) {
              //验证成功，通过token获取用户信息
              getUserInfo(resp.value.token).then((response) => {
                //获取到用户信息
                const respUser = response.data;
                if (respUser.flag) {
                  console.log("userinfo", respUser.data);
                  //1.保存token
                  localStorage.setItem("user", JSON.stringify(respUser.data));
                  localStorage.setItem("token", resp.value.token);
                  //前往首页
                  this.$router.push("./");
                } else {
                  this.$message({
                    message: "respUser.message",
                    type: "warning",
                  });
                }
              });
            } else {
              //未通过,弹出警告
              //alert(resp.message)
              this.$message({
                message: "resp.message",
                type: "warning",
              });
            }
          });

          //alert('submit!');
        } else {
          console.log("验证失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 300px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 28px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
 background:url("~@/assets/img/back.jpg") no-repeat;
 background-size: 100% 100%;
}
.login-title {
  color: #303133;
  text-align: center;
}
</style>
