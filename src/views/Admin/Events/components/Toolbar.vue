<template>
  <div class="toolbar_container">
    <!-- Button collection -->

    <div v-for="(button, key) in buttons" :key="key" class="button_wrapper">
      <div v-if="button.display">
        <s-button @click="button.method">
          <span v-html="button.label"></span>
        </s-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "Toolbar",
  components: {
    SButton: () => import("@/components/SButton")
  },
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
          display: this.currentView == "events",
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
            this.currentView == "events"
              ? 'View requests <i class="el-icon-arrow-right"></i> '
              : '<i class="el-icon-arrow-left"></i> View events',
          round: true,
          display: true,
          plain: true,
          method: () => {
            if (this.currentView == "events") {
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
.button_wrapper {
  padding: 10px;
}
</style>
