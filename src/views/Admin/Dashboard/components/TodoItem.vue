<template>
  <div class="todo_container p-1">
    {{ data }}
  </div>
</template>

<script>
export default {
  name: "Todo",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    todoButtonConfig() {}
  }
};
</script>

<style lang="scss" scoped>
.todo_container {
  border-bottom: $border;
}
</style>
