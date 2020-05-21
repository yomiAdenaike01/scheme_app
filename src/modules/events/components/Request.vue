<template functional>
  <div class="request_container">
    {{ props.request }}
  </div>
</template>

<script>
export default {
  name: "Request",
  props: {
    request: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style></style>
