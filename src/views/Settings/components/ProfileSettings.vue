<template>
  <div>
    {{ userInformation }}
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "ProfileSettings",
  computed: {
    ...mapState(["userInformation"])
  },
  methods: {}
};
</script>

<style></style>
