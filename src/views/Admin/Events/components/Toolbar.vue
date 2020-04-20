<template>
  <div class="toolbar_container">
    <!-- Button collection -->
    <el-button
      v-for="(button, key) in buttons"
      :key="key"
      round
      size="mini"
      :type="button.type ? button.type : 'primary'"
      :plain="button.plain"
      :disabled="button.disabled"
      @click="button.method"
    >
      {{ button.label }}
    </el-button>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "Toolbar",
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["events"]),
    buttonText() {
      let text = "Request management";

      if (this.getIsAdmin) {
        text = "Event management";
      }

      return text;
    },

    buttons() {
      let buttons = [
        {
          label: this.buttonText,
          round: true,
          plain: true,
          type: "primary",
          method: () => {
            this.UPDATE_DIALOG_INDEX({
              dialog: "eventModule",
              view: true
            });
          }
        }
      ];

      return buttons;
    }
  },
  methods: {
    ...mapMutations(["UPDATE_DIALOG_INDEX"])
  }
};
</script>

<style lang="scss" scoped>
.toolbar_container {
  display: flex;
  height: 30px;
  padding: 10px;
}
</style>
