<template>
  <div class="user_info_container">
    <h3>User Info</h3>
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
        if (
          property != "_id" &&
          property != "is_online" &&
          property != "employee_type"
        ) {
          cleanedProperties[property] = this.data[property];
        }
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
