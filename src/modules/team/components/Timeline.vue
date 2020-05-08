<template functional>
  <div class="events_timeline_container">
    <div v-for="event in props.events" :key="event._id" class="event">
      <div v-for="(value, key) in event" :key="key" class="data_field">
        <h4 v-if="typeof value != 'object'">{{ value }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Timeline",
  props: {
    events: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped lang="scss">
.events_timeline_container {
  position: relative;
  &::after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 1.6%;
    width: 6px;
    content: "";
    background: rgba(var(--colour_primary), 1);
  }
}
.event {
  display: flex;
  justify-content: space-evenly;
  padding: 10px;
  position: relative;
  &::after {
    border-radius: 50%;
    background: white;
    border: 2px solid rgba(var(--colour_primary), 1);
    content: "";
    padding: 30px;
    order: -1;
    margin-right: 30px;
    margin-left: -10px;
    z-index: 9;
  }
}
.event_details {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: $border;
  position: relative;

  &::after {
    content: "";
    background: inherit;
    top: 0;
    position: absolute;
    left: 20px;
    font-size: 0.5em;
    color: #999;
  }
}
</style>
