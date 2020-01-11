<template>
  <h1>{{ data.name }}</h1>
</template>

<script>
export default {
  name: "TeamUserInfo",
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
