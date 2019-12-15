<template>
  <span>{{message.content}}</span>
</template>

<script>
export default {
  name: "Message",
  props: {
    message: Object
  }
};
</script>

<style>
</style>