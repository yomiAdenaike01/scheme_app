<template functional>
  <div class="event">
    <div class="date_wrapper">
      <span>{{ props.event.start_date }}</span>
    </div>
    <div class="details_container" :class="props.event.time_code.value">
      <h3 class="capitalize">
        {{ props.event.type.label }}
      </h3>
      {{ props.event.start_time }} - {{ props.event.end_time }}
      <br />
      <span class="capitalize"
        ><strong>{{ props.event.time_code.label }}</strong></span
      >
      <br />
      <span class="capitalize">End date {{ props.event.end_date }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "RelatedEvents",
  props: {
    event: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
$time_code: (
  completed: var(--dark),
  upcoming: var(--colour_primary),
  in_progress: var(--purple)
);

.event {
  display: flex;
  margin: 10px;
  align-items: center;
  transition: $default_transition;
  border: $border;
}
.date_wrapper {
  display: flex;
  flex-direction: column;
  font-size: 1.4em;
  max-width: 80px;
  padding: 10px;

  span {
    white-space: pre-wrap;
  }
}
.details_container {
  flex: 1;
  padding: 30px;
  @each $key, $value in $time_code {
    &.#{$key} {
      background: rgba($value, 0.06);
      color: rgba($value, 0.9);
      border-left: 4px solid rgba($value, 0.9);
    }
  }
}
</style>
