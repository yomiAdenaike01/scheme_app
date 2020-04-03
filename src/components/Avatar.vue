<template>
  <div class="avatar_container">
    <el-avatar :style="{ background: randColour() }">{{
      !isNameTheSame ? initials : "ME"
    }}</el-avatar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Avatar",
  props: {
    name: String,
    default: null
  },
  computed: {
    ...mapState(["defaultCustomColours", "userInformation"]),
    ...mapState("Admin", ["teamInformation"]),

    isNameTheSame() {
      return (
        this.userInformation?.name.trim().toLowerCase() ==
        this?.name?.trim().toLowerCase()
      );
    },

    initials() {
      let initials,
        username = this.name ? this.name : "User";
      let parts = username.split(/[ -]/);
      initials = "";
      for (var i = 0; i < parts.length; i++) {
        initials += parts[i].charAt(0);
      }
      if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
        initials = initials.replace(/[a-z]+/g, "");
      }
      initials = initials.substr(0, 3).toUpperCase();
      return initials;
    }
  },
  methods: {
    randColour() {
      return this.defaultCustomColours[
        Math.round(Math.random() * this.defaultCustomColours.length)
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar_container {
  max-height: 40px;
  max-width: 40px;
  padding: 5px;
  box-shadow: $box_shadow;
  border-radius: 50%;
  &.full {
    max-height: initial;
    max-width: initial;
  }
}
</style>
