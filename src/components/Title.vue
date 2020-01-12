<template>
  <div class="title_wrapper" :class="defaultClass">
    <h1 class="m-0 p-0" v-if="title">{{ title }}</h1>
    <p v-if="subtitle" class="grey">{{ subtitle }}</p>
    <br />
    <slot></slot>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Title",
  props: {
    defaultClass: {
      type: String,
      default: "m-3"
    },
    title: String,
    subtitle: String
  },
  computed: { ...mapState(["defaultSize"]) }
};
</script>
<style lang="scss" scoped>
.title_wrapper {
  color: black;
}
p {
  font-size: 0.8em;
}
</style>
