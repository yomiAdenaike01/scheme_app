<template>
  <div class="notes_container"></div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Notes",
  computed: {
    ...mapState("Admin", ["notes"])
  }
};
</script>

<style>
</style>