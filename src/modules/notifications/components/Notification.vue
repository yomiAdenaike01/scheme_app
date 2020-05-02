<template functional>
  <div>
    <p>{{ props.title }}</p>
    <p>{{ props.message }}</p>
  </div>
</template>

<script>
export default {
  name: "Notification",
  props: {
    api: {
      type: Boolean,
      default: false
    },
    methods: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    message: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "info"
    }
  }
};
</script>

<style lang="scss" scoped></style>
