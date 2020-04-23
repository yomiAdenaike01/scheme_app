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
      <span v-html="button.label"></span>
    </el-button>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "Toolbar",
  props: {
    currentView: {
      type: String,
      default: ""
    }
  },
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
        },
        {
          label:
            this.currentView == ""
              ? 'View requests <i class="el-icon-arrow-right"></i> '
              : '<i class="el-icon-arrow-left"></i> View events',
          round: true,
          plain: true,
          type: "text",
          method: () => {
            if (this.currentView == "requests") {
              this.$emit("changeView", "requests");
            } else {
              this.$emit("changeView", "events");
            }
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
  padding: 10px;
}
</style>
