<template>
    <div>
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
            <!-- 重置会看el-form-item 组件元素的prop上是否指定了字段名，指定了才会重置生效 -->
           <el-form-item prop="username" >
              <el-input v-model="searchMap.username" placeholder="会员名称" style="width:200px"></el-input>
           </el-form-item>
           <el-form-item prop="name">
              <el-input v-model="searchMap.name" placeholder="会员账号" style="width:200px"></el-input>
           </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button type="primary" @click="handleAdd()">新增</el-button>
            <el-button  @click="$refs['searchForm'].resetFields()">重置</el-button>
         </el-form-item>
        </el-form>

         <el-table :data="list" height="380" border style="width: 100%">
        <!-- type=”index“获取索引值，从1开始，label显示标题，prop数据字段名 -->
        <el-table-column type="index"  label="序号" width="60px"></el-table-column>
        <el-table-column prop="username"  label="会员账号" ></el-table-column>
        <el-table-column prop="name"  label="会员名称" width="90px"></el-table-column>
        <el-table-column prop="age"  label="年龄" ></el-table-column>
        <el-table-column prop="mobile"  label="电话" ></el-table-column>
         <el-table-column prop="salary"  label="积分台账" ></el-table-column>
          <el-table-column prop="entryDate"  label="入会时间" ></el-table-column>
        <el-table-column label="操作" width="150">
           <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
           </template>
        </el-table-column>
    </el-table>
     <!-- 分页组件 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

      <el-dialog title="积分台账编辑" :visible.sync="dialogFormVisible" width="500px">
       <el-form :rules="rules" ref="pojoForm" label-width="100px" label-position="right" style="width:400px"
         :model="pojo">
          <el-form-item label="会员账号" prop="username">
              <el-input v-model="pojo.username" ></el-input>
          </el-form-item>
          <el-form-item label="会员名称" prop="name">
              <el-input v-model="pojo.name" ></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
              <el-input v-model="pojo.age" ></el-input>
          </el-form-item>
           <el-form-item label="电话" prop="mobile">
                <el-input v-model="pojo.mobile"></el-input>
           </el-form-item>
           <el-form-item label="积分台账" prop="salary">
                <el-input v-model="pojo.salary" ></el-input>
           </el-form-item>
            <el-form-item label="入会时间" prop="entryDate">
               <el-date-picker value-format="yyyy-MM-dd" v-model="pojo.entryDate" type="date" placeholder="入职时间"></el-date-picker>
           </el-form-item>
           
          </el-form>
          <div slot="footer" class="dialog-footer">
           <el-button @click="dialogFormVisible = false">取 消</el-button>
           <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
           <el-button type="primary" @click="pojo.id===null?addData('pojoForm'):updateData('pojoForm')">确 定</el-button>
          </div>
   </el-dialog>

    </div>
</template>
<script>
import staffApi from '@/api/staff'
export default {
    data(){
        return{
            list:[],
            pageSize:10,
            currentPage:1,
            total:0,
            searchMap:{},
            dialogFormVisible:false,
            rules:{
                username:[{required:'true',message:'账号不能为空',trigger:'blur'}],
                name:[{required:'true',message:'名称不能为空',trigger:'blur'}],
            },
            pojo:{
                id:null,
                username:'',
                name:'',
                age:'',
                mobile:'',
                salary:0,
                entryDate:''
            }
        }
    },
    created(){
        this.fetchData()
    },
    methods:{
        fetchData(){
            staffApi.search(this.pageSize,this.currentPage,this.searchMap).then(response=>{
                const data=response.data.data
                this.list=data.rows
                this.total=data.total
                // console.log(list)
                
            })
        },
        //新增人员
        handleAdd(){
         this.dialogFormVisible=true
          this.$nextTick(()=>{  //异步事件,渲染结束之后，回调函数才会被执行，弹出窗口打开后需要家在DOM，就需要花费一点时间记载完成dom之后，在吊桶resetfields方法，重置表单和清除样式
              this.$refs['pojoForm'].resetFields()
            })
        },
        addData(formName){
            this.$refs[formName].validate(valid=>{
                   if(valid){
                     staffApi.add(this.pojo).then(response=>{
                         const resp=response.data
                         console.log(response.data)
                         if(resp.flag){
                             this.dialogFormVisible=false
                             this.fetchData
                             this.$message({
                                 message:"添加成功，初始密码为123456",
                                 type:'success'
                             })
                         }else{
                             this.$message({
                                 message:resp.message,
                                 type:'warning'
                             })
                         }
                     })
                   }else{
                         return false
                   }
            })
        },
       handleSizeChange(val){
           this.pageSize=val
           this.fetchData()
       },
      handleCurrentChange(val){
          this.currentPage=val
          this.fetchData()
      },
      //编辑
      handleEdit(id){
          this.handleAdd()
          staffApi.getById(id).then(response=>{
              const resp=response.data
              if(resp.flag){
                  this.pojo=resp.data
              }
          })
      },
      updateData(formName){
          this.$refs[formName].validate(valid=>{
              if(valid){
                 staffApi.update(this.pojo).then(response=>{
                     const resp=response.data
                     if(resp.flag){
                        this.dialogFormVisible=false
                        this.fetchData()
                     }else{
                        this.$message({
                                 message:resp.message,
                                 type:'warning'
                             }) 
                     }
                 })
              }else{
                  return false
              }
          })
      },
      //删除
      handleDelete(id){
          this.$confirm("确定要删除这位员工吗","提示",{
               confirmButtonText:'确认',
               cancleButtonText:'取消',
          }).then(()=>{
              //确定
              staffApi.deleteById(id).then(response=>{
                  const resp=response.data
                  this.$message({
                      message:resp.message,
                      type:resp.message?'success':'error'
                  })
                  if(resp.flag){
                   this.fetchData()
                  }
              })
          }).catch(()=>{
              //取消
          })
      }
    }
}
</script>
<style scoped>
.el-pagination {
  text-align: center;
}
</style>