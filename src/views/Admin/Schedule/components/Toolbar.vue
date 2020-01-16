<template>
  <el-row type="flex" :gutter="10" align="middle">
    <el-col>
      <!-- Button collection -->
      <el-button
        :icon="button.icon ? button.icon : null"
        v-for="(button,key) in buttons"
        :round="button.round"
        :type="button.type ? button.type :'primary'"
        :key="key"
        plain
        size="small"
        @click="button.emit ? $emit('modalChanges',button.emit) : button.method ? button.method : null"
      >{{button.label}}</el-button>
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
    buttons() {
      return [
        {
          label: "View Filters",
          emit: "view_filters",
          round: true,
          icon: "el-icon-search"
        },
        {
          label: "Create event",
          emit: "create_event",
          round: true,
          icon: "el-icon-date"
        },
        {
          label: "Create employee",
          emit: "create_employee",
          round: true,
          icon: "el-icon-user"
        }
      ];
    }
  }
};
</script>

<style>
</style>