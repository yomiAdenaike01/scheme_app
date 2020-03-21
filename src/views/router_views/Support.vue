<template>
  <div class="support_container h-100">
    <header>
      <div
        class="go_back_container p-3 grey flex align-center"
        @click="$router.go(-1)"
      >
        <i class="el-icon-arrow-left trigger"></i>
        <p class="trigger">Go back</p>
      </div>
    </header>
    <div class="support_body_container h-100">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SupportCentre",
  activated() {
    this.closeDialog();
  },
  methods: {
    ...mapActions(["closeDialog"])
  }
};
</script>

<style lang="scss" scoped>
header {
  box-shadow: $box_shadow;
}
</style>
