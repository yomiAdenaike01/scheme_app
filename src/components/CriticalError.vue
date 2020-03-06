<template>
  <div class="flex_center critical_error_container">
    <el-card>
      <div class="flex_center">
        <Nocontent v-bind="errorDisplay" />
      </div>
    </el-card>
  </div>
</template>

<script>
import Nocontent from "@/components/Nocontent";
export default {
  name: "ClientError",
  created() {
    document.title = "Critcal Server Error";
  },
  computed: {
    errorDisplay() {
      return {
        text:
          "You have encountered a critical server error, to proceed please contact support so that this can be fixed",
        icon: "el-icon-warning-outline",
        buttonText: "Hello"
      };
    }
  },
  methods: {
    displaySolutions() {
      console.log("Hello");
    }
  },
  components: {
    Nocontent
  }
};
</script>

<style lang="scss" scoped>
.critical_error_container {
  height: 100%;
}
</style>
