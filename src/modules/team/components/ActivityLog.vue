<template functional>
  <div class="activity_container">
    <span>{{ props.activity.action }}</span>
    <p class="grey">{{ props.dateCreated }}</p>
  </div>
</template>

<script>
export default {
  name: "ActivityLog",
  props: {
    activity: {
      type: Object,
      default: () => {}
    },
    dateCreated: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.activity_container {
  margin: 10px 0;
  p {
    margin: 0;
  }
}
</style>
