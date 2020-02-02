<template>
  <div class="user_info_container">
    <h5>User Info</h5>
    <p v-for="(property, index) in removeUnwantedProperties" :key="index">
      {{ index }} : {{ property }}
    </p>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          name: "John Doe"
        };
      }
    }
  },
  computed: {
    removeUnwantedProperties() {
      let cleanedProperties = {};
      for (let property in this.data) {
        cleanedProperties[property] = this.data[property];
      }
      return cleanedProperties;
    }
  }
};
</script>

<style lang="scss" scoped>
.user_info_container {
  line-height: 2em;
}
</style>
