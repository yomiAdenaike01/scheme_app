<template>
  <div>
    {{ request }}
    {{ date }}
  </div>
</template>

<script>
export default {
  name: "FeatureRequest",
  props: {
    request: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    date() {
      return this.formatDate(this.request.dateCreated);
    }
  }
};
</script>

<style></style>
