<template>
  <div class="user_info_container">
    <div class="flex flex--end align-center">
      <el-button round @click="requestgenEmail">Contact</el-button>
    </div>
    <h5>User Info</h5>
    <p v-for="(property, index) in removeUnwantedProperties" :key="index">
      {{ index }} : {{ property }}
    </p>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "UserInfo",
  props: {
    data: {
      type: Object,
      default: () => {}
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
  },
  methods: {
    ...mapActions(["genEmail"]),
    requestgenEmail() {
      let emailContent = {
        to: "adenaikeyomi@gmail.com",
        subject: "even diff Contact",
        context: {
          test: "Hello from the render"
        }
      };
      this.genEmail(emailContent)
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.warn(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.user_info_container {
  line-height: 2em;
}
</style>
