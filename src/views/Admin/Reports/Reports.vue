<template>
  <div class="reports_container flex_center m-4"></div>
</template>

<script>
import Tabs from "@/components/Tabs";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "Reports"
};
</script>

<style lang="scss" scoped>
.reports_container {
  height: 100%;
  width: 100%;
  line-height: 2em;
  font-size: 1.3em;
}
</style>