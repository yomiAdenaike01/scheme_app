<template functional>
  <div class="event">
    {{ props.event.start_date }} -
    {{ props.event.end_date }}
  </div>
</template>

<script>
export default {
  name: "RelatedEvent",
  props: {
    event: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
.event {
  padding: 15px;
  margin: 10px;
  box-shadow: $box_shadow;
}
</style>
