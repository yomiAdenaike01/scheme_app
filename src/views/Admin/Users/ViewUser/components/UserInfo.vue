<template>
  <div class="user_info_container">
    <div class="flex flex--end align-center">
      <el-button round @click="requestgenEmail">Contact</el-button>
    </div>
    <h3>User Info</h3>
    <p>{{date}}</p>
    <p>{{data.name}}</p>
    <p>{{data.email}}</p>
    <p class="member_name">{{group}}</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "UserInfo",
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters("Admin", ["getGroupName"]),
    date() {
      return this.formatDate(this.data.dateCreated);
    },
    group() {
      return this.getGroupName("event", this.data.groupID).name;
    },
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
