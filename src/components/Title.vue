<template>
  <div class="title_wrapper m-3">
    <h1 v-if="title" class="light">{{ title }}</h1>
    <span v-if="subtitle" class="grey">{{ subtitle }}</span>
  </div>
</template>

<script>
export default {
  name: "Title",
  props: {
    title: String,
    subtitle: String
  }
};
</script>
<style lang="scss" scoped>
span {
  font-size: 0.8em;
  margin-top: -20px;
}
</style>
