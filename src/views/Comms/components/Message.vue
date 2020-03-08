<template>
  <div class="message_container">
    {{ data }}
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>

<style></style>
