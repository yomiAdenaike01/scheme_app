<template>
  <div class="customisation_wrapper">
    <div class="flex_center columns">
      <Title defaultClass="m-0" subtitle="Primary Colour" />
      <ThemeSelection :syncClient="true" />
      <Title defaultClass="m-0" subtitle="Sidebar Colour" />
      <ThemeSelection target="sidebar" />
    </div>
    <ChangeLogo />
  </div>
</template>

<script>
import ThemeSelection from "@/components/ThemeSelection";
import ChangeLogo from "./selections/ChangeLogo";
import { mapMutations } from "vuex";
import Title from "@/components/Title";
export default {
  name: "CustomisationSettings",
  methods: {
    ...mapMutations(["RESET_THEME"])
  },
  components: {
    ThemeSelection,
    Title,
    ChangeLogo
  }
};
</script>

<style lang="scss" scoped>
.customisation_wrapper {
  .el-color-picker__trigger {
    width: 100px;
    height: 100px;
    margin: 30px;
  }
}
.reset_button_container {
  display: flex;
  justify-content: flex-end;
}
</style>
