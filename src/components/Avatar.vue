<template>
  <el-avatar :style="{ background: randColour }">
    {{ initials }}
  </el-avatar>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Avatar",
  props: {
    name: String
  },
  computed: {
    ...mapState(["defaultCustomColours"]),
    randColour() {
      return this.defaultCustomColours[
        Math.round(Math.random() * this.defaultCustomColours.length)
      ];
    },
    initials() {
      let initials, username;
      username = "John Doe";
      if (this.name) {
        username = this.name;
        let parts = username.split(/[ -]/);
        initials = "";
        for (var i = 0; i < parts.length; i++) {
          initials += parts[i].charAt(0);
        }
        if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
          initials = initials.replace(/[a-z]+/g, "");
        }
        initials = initials.substr(0, 3).toUpperCase();
      }
      return initials;
    }
  }
};
</script>

<style></style>
