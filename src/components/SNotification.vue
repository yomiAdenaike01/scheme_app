<template functional>
  <div
    :class="[
      'notification_container',
      data.class,
      data.staticClass,
      props.type
    ]"
  >
    <div class="body_container">
      {{ props.title }}
      {{ props.message }}
    </div>
    <div class="functions_container">
      <div
        v-for="(method, index) in props.methods"
        :key="index"
        class="function"
        @click="method.function"
      >
        <p>{{ method.label }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SNotification",
  props: {
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

<style lang="scss" scoped>
.notification_container {
  padding: 20px;
  background: white;
  box-shadow: $box_shadow;
  z-index: 19;
}
</style>
