<template>
  <div class="reports_container">
    <h1>Reports</h1>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs";
export default {
  name: "Reports",
  computed: {
    tabs() {
      return [
        {
          label: ""
        },
        {
          label: ""
        }
      ];
    }
  },
  components: {
    Tabs
  }
};
</script>

<style>
</style>