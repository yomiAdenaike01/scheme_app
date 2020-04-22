<template functional>
  <div class="event_container">
    {{ props.event }}
    <p>{{ props.event.timeState }}</p>
    <p>{{ props.event.startDate }}</p>
    <p>{{ props.event.endDate }}</p>
    <p>{{ props.event.dateCreated }}</p>
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
  border: 2px solid whitesmoke;
}
</style>
