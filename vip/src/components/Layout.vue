<template>
    <div>
        <app-header></app-header>
        <app-navbar></app-navbar>
        <app-main></app-main>
    </div>
</template>
<script>
//回导入该路径下面的index.vue
import AppHeader from './AppHeader'
import AppNavbar from './AppNavbar'
import AppMain from './AppMain'
export default{
    components:{AppHeader,AppNavbar,AppMain}
}
</script>


<style scoped>
/* 头部区域 */
.header{
    position: absolute;
    line-height: 50px;
    top:0;
    left:0px;
    right: 0px;
    background-color: #2d3a4b;
}
.navbar{
    position: absolute;
    width: 230px;
    top:50px;
    background-color: #545c64;
    left:0;
    bottom:0;
    overflow-y:auto;
}
.main{
    position: absolute;
    top:50px;
    left:230px;
    right: 0;
    bottom:0;
    padding:10px;
    overflow-y:auto;
    /* background-color: red; */

}
</style>