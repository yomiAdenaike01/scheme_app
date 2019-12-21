<template>
  <h1></h1>
</template>

<script>
import prompts from "@/mixins/prompts";
import { mapMutations } from "vuex";
export default {
  name: "Logout",
  mixins: [prompts],
  created() {
    this.message("Log Out", "Are you sure you want to log out ?", "Okay").then(
      response => {
        this.REMOVE_USER();
      }
    );
  },
  methods: {
    ...mapMutations(["REMOVE_USER"])
  }
};
</script>

<style>
</style>