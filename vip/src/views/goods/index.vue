<template>
    <div>
        <!-- ：inline="true"  表单一行显示 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px"
    >
      <!-- 重置会看 el-form-item 组件元素的prop上是否指定了字段名，指定了才会重置生效-->
      <el-form-item prop="name">
        <el-input
          v-model="searchMap.name"
          placeholder="会员名称"
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="searchMap.code"
          placeholder="会员卡号"
          style="width: 200px"
        ></el-input>
      </el-form-item>
       <!-- el-input是组件，要在组件元素上监听原生事件，需要使用v-on：原声事件名：native=“处理函数” -->
       <el-form-item prop="supplierName">
        <el-input readonly
         @click.native="dialogSupplierVisible=true"
          v-model="searchMap.supplierName"
          placeholder="电话号码"
          style="width: 200px"
        ></el-input>
      </el-form-item>
      
      
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button> 
      </el-form-item>
    </el-form> 


         <!-- 表格组件 -->
    <el-table :data="list" height="380" border style="width: 100%">
      <!-- type="index"获取索引值，从1开始，label显示标题，prop数据字段名。width -->
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="name" label="会员名称"> </el-table-column>
      <el-table-column prop="code" label="对应编码" width="90"></el-table-column>
      <el-table-column prop="spec" label=""> </el-table-column>
      <el-table-column prop="retailPrice" label="充值金额"> </el-table-column>
      <el-table-column prop="purchasePrice" label="充值金额比例"> </el-table-column>
      <el-table-column prop="storageNum" label="剩余余额"> </el-table-column>
      <el-table-column prop="supplierName" label="住址"> </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 选择供应商对话框 -->
    <el-dialog title="选择" :visible.sync="dialogSupplierVisible" width="500px">
        <supplier @option-supplier="optionSupplier" :isDialog="true"></supplier>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="500px">
         <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :model="pojo"
      >
        <el-form-item label="会员名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="对应编码" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item label="" prop="spec">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="充值金额" prop="retailPrice">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="充值金额比例" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="剩余余额" prop="storageNum">
          <el-input v-model="pojo.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="住址" prop="supplierName">
          <el-input readonly @click.native="editOptionSupplier" v-model="pojo.supplierName" placeholder="选择供应商"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button type="primary" @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm') ">确 定</el-button>
      </div>
    </el-dialog>

    </div>
</template>
<script>
import goodsApi from '@/api/goods'
import Supplier from '@/views/supplier'

export default{
    //注册supplier作为子组件
    components:{Supplier},
  data(){
      return{
          list:[],
          total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条数据,
      searchMap:{
          name:'',
          code:'',
          supplierName:''
      },
      dialogSupplierVisible:false,//弹出选择会员对话框
      dialogFormVisible:false,//编辑窗口
       pojo: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: 0.0,
        purchasePrice:0.0,
        storageNum:0,
        supplierName:'',
        supplierId:null
      }, //提交的数据
      rules: {
        //校验规则
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        code: [{ required: true, message: "不能为空", trigger: "blur" }],
         retailPrice: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      isEdit:false //是否为编辑窗口
      }
  },
  created(){
      this.fetchData()
  },
  methods:{
      fetchData(){
          goodsApi.search(this.currentPage,this.pageSize,this.searchMap).then(response=>{
              const data=response.data.data
              this.list=data.rows
              this.total=data.total
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
      optionSupplier(currentRow){
          console.log("parent",currentRow)
          if(this.isEdit){
              //是编辑窗口打开的供应商
              console.log(11)
              this.pojo.supplierName=currentRow.name//会员名称
              this.pojo.supplierId=currentRow.id //会员id
          }else{
              console.log(22)
              //是搜索区域打开的选择会员
              this.searchMap.supplierName=currentRow.name//会员名称
              this.searchMap.supplierId=currentRow.id //会员id
          }
           this.isEdit=false //注意重新赋值false
           this.dialogSupplierVisible=false;//关闭窗口
      },
      handleAdd(){
          this.dialogFormVisible = true;
      this.$nextTick(() => {
        //this.$nextTick()异步事件，当炫染结束之后，他的回调函数才会被执行
        //弹出窗口打开之后，需要加载dom，就需要花费一点时间，我们就应该等他加载完dom，在进行调用resetFields()，重置表单和清除样式
        this.$refs["pojoForm"].resetFields();
      });
      },
      addData(formName){
          this.$refs[formName].validate((valid) => {
        if (valid) {
          //提交表单
          goodsApi.add(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                massage: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
      },
      //更新数据
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          goodsApi.update(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              //更新成功，刷新数据，关闭窗口
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              //提示更新失败
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
      //打开编辑窗口
    handleEdit(id) {
      //console.log('编辑',id)
      this.handleAdd();
      goodsApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          //提示获取数据失败
          this.$message({
            message: resp.message,
            type: "warning",
          });
        }
      });
    },
    //删除
    handleDelete(id) {
      //清除表单数据和校验结果
      console.log("删除", id);
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          goodsApi.deleteById(id).then((response) => {
            const resp = response.data;
            //提示更新失败
            this.$message({
                  message:resp.message,
                  type:resp.flag?'success':'error'
              })
            if (resp.flag) {
                //删除成功
                this.fetchData()
            }
          });
        })
        .catch(() => {
          //取消删除
        });
    },
      editOptionSupplier(){
          this.isEdit=true //当前是通过编辑窗口的选择供应商打开的窗口
          this.dialogSupplierVisible=true
      }


  }
}
</script>
<style scoped>
.el-pagination {
  text-align: center;
}
</style>
