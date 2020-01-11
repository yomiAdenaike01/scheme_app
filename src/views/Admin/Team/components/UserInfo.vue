<template>
  <h1>{{ data.name }}</h1>
</template>

<script>
export default {
  name: "UserInfo",
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          name: "John Doe"
        };
      }
    }
  }
};
</script>

<style></style>
