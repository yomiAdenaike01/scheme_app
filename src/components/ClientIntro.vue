<template>
  <transition name="fade-transform" mode="out-in">
    <div class="intro_container h-100 flex_center columns">
      <div class="intro_inner_container">
        <div class="title_wrapper">
          <h1 v-if="!isError">
            Welcome to
            <span class="logo">S</span>cheme <span class="logo">C</span>loud
          </h1>
          <h1 v-else>
            An
            <span class="logo">E</span>rror occured.
          </h1>
          <h5 class="grey">
            Enter your company name or domain name into the field below
          </h5>
        </div>
        <el-input
          class="domain_input"
          placeholder="Domain Name"
          v-model="clientDomain"
          @keydown.enter="refactorWindowLocation(clientDomain.replace(/\s/g,'').toLowerCase())"
        ></el-input>
        <div
          :class="{ active: clientDomain.length > 0 }"
          class="flex flex--end align-center button_container"
        >
          <el-button
            @click="refactorWindowLocation(clientDomain)"
            type="primary"
            size="mini"
            round
          >
            Load cloud instance
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import refactorLocation from "@/mixins/refactorLocation";
import { mapState } from "vuex";
export default {
  name: "ClientIntro",
  data() {
    return {
      clientDomain: ""
    };
  },
  mixins: [refactorLocation],
  activated() {
    if (this.isError) {
      this.$message.error(
        "There was an error, please enter your client domain again to restart"
      );
    }
  },
  computed: {
    ...mapState(["invalidClient"]),
    isError() {
      return this.invalidClient.error;
    }
  }
};
</script>

<style lang="scss" scoped>
.title_wrapper {
  line-height: 2.3em;
}
.intro_inner_container {
  text-align: center;
  width: 50%;
  line-height: 3.4em;
}
.domain_input {
  max-width: 800px;
}
.button_container {
  will-change: transform;
  transition: 0.56s ease-in-out all;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-10px);
  &.active {
    pointer-events: initial;
    transform: translateX(0px);
    opacity: 1;
  }
}
</style>
