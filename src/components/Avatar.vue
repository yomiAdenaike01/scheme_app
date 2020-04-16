<template>
  <div class="avatar_container">
    <customAvatar :username="name" :lighten="100" :size="size" class="avatar">
    </customAvatar>
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
    name: String,
    size: {
      type: Number,
      default: 50
    }
  }
};
</script>
<style lang="scss" scoped>
.avatar_container {
  position: relative;
}
.avatar {
  margin: 5px;
}
</style>
