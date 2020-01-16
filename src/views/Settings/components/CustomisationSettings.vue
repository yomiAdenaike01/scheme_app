<template>
  <div class="customisation_wrapper flex_center columns">
    <Title defaultClass="m-0" subtitle="Primary Colour" />
    <ThemeSelection />
    <Title defaultClass="m-0" subtitle="Sidebar Colour" />
    <ThemeSelection />
  </div>
</template>

<script>
import ThemeSelection from "@/components/ThemeSelection";
import { mapMutations } from "vuex";
import Title from "@/components/Title";
export default {
  name: "CustomisationSettings",

  methods: {
    ...mapMutations(["RESET_THEME"])
  },
  components: {
    ThemeSelection,
    Title
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