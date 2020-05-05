<template functional>
  <div class="event_container">
    {{ props.event }}
    <p>{{ props.event.timeState }}</p>
    <p>{{ props.event.start_date }}</p>
    <p>{{ props.event.end_date }}</p>
    <p>{{ props.event.date_created }}</p>
  </div>
</template>

<script>
export default {
  name: "FunctionalEvent",
  props: {
    event: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
.event_container {
  padding: 10px;
  border: $border;
}
</style>
