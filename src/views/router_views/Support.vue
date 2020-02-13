<template>
   <div class="support_container h-100">
    <div class="go_back_container p-3 grey flex align-center" @click="$router.push({name:'dashboard'})">
    <i class="el-icon-arrow-left trigger" ></i>
    <p class="trigger">Go Back</p>
    </div>
    <RouterTransition>
      <keep-alive>
  <router-view></router-view>
  </keep-alive>
    </RouterTransition>
    </div>
</template>

<script>
import RouterTransition from "@/components/RouterTransition"
export default {
  name: "SupportCentre",
  components:{
    RouterTransition
  }
};
</script>

<style>
</style>