<template>
  <el-row type="flex" :gutter="10" align="middle">
    <el-col>
      <!-- Button collection -->
      <el-button
        :icon="button.icon ? button.icon : null"
        v-for="(button, key) in buttons"
        :round="button.round"
        :type="button.type ? button.type : 'primary'"
        :key="key"
        size="small"
        @click="
          button.emit
            ? $emit('modalChanges', button.emit)
            : button.method
            ? button.method
            : null
        "
        >{{ button.label }}</el-button
      >
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Toolbar",
  methods: {},
  computed: {
    ...mapGetters(["getIsAdmin"]),

    renderCreateEventButton() {
      let render = {
        text: "Create request",
        icon: "el-icon-question"
      };
      if (this.getIsAdmin) {
        render = {
          text: "Create Event",
          icon: "el-icon-date"
        };
      }
      return render;
    },

    buttons() {
      let buttons = [
        {
          label: "Schedule filters",
          emit: "schedule_view",
          round: true,
          icon: "el-icon-setting"
        },
        {
          label: this.renderCreateEventButton.text,
          emit: "create_event",
          round: true,
          icon: this.renderCreateEventButton.icon
        }
      ];
      if (this.getIsAdmin) {
        buttons.push({
          label: "Create employee",
          emit: "create_employee",
          round: true,
          icon: "el-icon-user"
        });
      }
      return buttons;
    }
  }
};
</script>

<style></style>
