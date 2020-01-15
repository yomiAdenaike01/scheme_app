<template>
  <div class="customisation_wrapper">
    <p>Primary Colour</p>
    <ThemeSelection />
    <p>Sidebar Colour</p>
    <el-color-picker size="medium" />
    <br />
    <div class="reset_button_container">
      <el-button @click="RESET_THEME">Reset theme settings</el-button>
    </div>
  </div>
</template>

<script>
import ThemeSelection from "@/components/ThemeSelection";
import { mapMutations } from "vuex";
export default {
  name: "CustomisationSettings",
  components: {
    ThemeSelection
  },
  methods: {
    ...mapMutations(["RESET_THEME"])
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