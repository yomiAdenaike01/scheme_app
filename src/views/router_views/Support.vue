<template>
  <div class="support_container">
    <header>
      <div class="go_back_container" @click="goBackLogic.method()">
        <i class="el-icon-arrow-left trigger"></i>
        <p class="trigger">{{ goBackLogic.text }}</p>
      </div>
    </header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "SupportCentre",
  computed: {
    ...mapState(["networkError"]),
    goBackLogic() {
      return {
        text: this.networkError ? "Log out" : "Go back",
        method: this.networkError ? this.REMOVE_USER : this.$router.back
      };
    }
  },
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
