<template>
  <div class="support_container">
    <header>
      <div
        class="go_back_container p-3 grey flex align-center"
        @click="$router.go(-1)"
      >
        <i class="el-icon-arrow-left trigger"></i>
        <p class="trigger">Go back</p>
      </div>
    </header>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  name: "SupportCentre",

};
</script>

<style lang="scss" scoped>
.support_container{
  display:flex;
  flex:1;
  flex-direction: column;
}
header {
  box-shadow: $box_shadow;
}
</style>
