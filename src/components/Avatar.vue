<template>
  <div class="avatar_container" :class="{ multiple }">
    <custom-avatar
      :username="name"
      :lighten="100"
      :size="size"
      class="avatar"
    />
    <slot />
  </div>
</template>

<script>
export default {
  name: "Avatar",
  components: {
    customAvatar: () => import("vue-avatar")
  },
  props: {
    name: {
      type: String,
      default: "U"
    },
    size: {
      type: Number,
      default: 50
    },
    multiple: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
.avatar_container {
  position: relative;
  &.multiple {
    margin: 0 -10px;
    cursor: pointer;
  }
}
.avatar {
  margin: 5px;
}
</style>
