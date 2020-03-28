<template>
  <div class="support_container">
    <header>
      <div class="go_back_container" @click="REMOVE_USER()">
        <i class="el-icon-arrow-left trigger"></i>
        <p class="trigger">Log out</p>
      </div>
    </header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "SupportCentre",
  methods: {
    ...mapMutations(["REMOVE_USER"])
  }
};
</script>

<style lang="scss" scoped>
.support_container {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.go_back_container {
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  i {
    margin-right: 5px;
  }
}
header {
  box-shadow: $box_shadow;
}
</style>
