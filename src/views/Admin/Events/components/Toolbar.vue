<template>
  <div class="toolbar_container">
    <!-- Button collection -->
    <el-button
      v-for="(button, key) in buttons"
      :key="key"
      :round="button.round"
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

  methods: {
    ...mapMutations(["UPDATE_DIALOG_INDEX"])
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["eventsInformation"]),
    hasGcal() {
      return "gcalToken" in this.userInformation;
    },
    renderCreateEventButton() {
      let render = {
        text: "Request Management"
      };

      if (this.getIsAdmin) {
        render.text = "Event management";
      }

      return render;
    },

    buttons() {
      let buttons = [
        {
          label: this.renderCreateEventButton.text,
          round: true,
          plain: true,
          type: "primary",
          method: () => {
            this.UPDATE_DIALOG_INDEX({
              dialog: "eventModule",
              view: true
            });
          },
          icon: this.renderCreateEventButton.icon
        }
      ];
      if (this.eventsInformation.previous.length > 0) {
        buttons.push({
          label: "<i class='bx bx-timer'></i> View previous events",
          round: true,
          plain: true,
          method: () => {
            this.UPDATE_DIALOG_INDEX({
              dialog: "prevEvents",
              view: true
            });
          }
        });
      }
      return buttons;
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar_container {
  display: flex;
  flex: 1;
  padding: 10px;
  max-height: 38px;
  min-height: 30px;
}
</style>
