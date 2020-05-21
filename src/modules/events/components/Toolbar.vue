<template>
  <div class="toolbar_container">
    <!-- Button collection -->

    <div v-for="(button, key) in buttons" :key="key" class="button_wrapper">
      <div v-if="button.display">
        <s-button
          :class="`${button.class ? button.class : 'rounded primary'}`"
          :icon="button.icon"
          :inverse-icon="button.inverseIcon"
          @click="button.method"
        >
          <span>{{ button.label }}</span>
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
    ...mapGetters(["adminPermission"]),
    ...mapState(["userInformation"]),
    ...mapState("Events", ["events"]),
    buttonText() {
      let text = "Request management";

      if (this.adminPermission) {
        text = "Event management";
      }

      return text;
    },

    buttons() {
      let buttons = [
        {
          label: this.buttonText,
          display: this.currentView == "events",
          shadow: this.currentView == "events",
          icon: "calendar",
          class: "primary rounded shadow",
          inverseIcon: false,
          method: () => {
            this.$emit("updateOverlays", "events");
          }
        },
        {
          label:
            this.currentView == "events" ? "View requests " : "View events",
          icon: this.currentView == "events" ? "right-arrow-alt" : "arrow-back",
          display: true,
          class:
            this.currentView == "requests"
              ? "secondary rounded"
              : "primary rounded",
          inverseIcon: this.currentView == "requests",
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
    ...mapMutations(["UPDATE_OVERLAY_INDEX"])
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
