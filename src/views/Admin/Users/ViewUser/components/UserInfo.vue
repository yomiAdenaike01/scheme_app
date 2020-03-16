<template>
  <div class="user_info_container" v-loading="loading">
    <div class="flex flex--end align-center">
      <el-button round @click="requestgenEmail">Contact</el-button>
      <el-button type="danger" plain v-if="getIsAdmin" round @click="removeUser"
        >Remove</el-button
      >
    </div>
    <h3>User Info</h3>
    <p>{{ date }}</p>
    <p>{{ data.name }}</p>
    <p>{{ data.email }}</p>
    <p class="member_name">{{ group }}</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "UserInfo",
  data() {
    return {
      loading: false
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters("Admin", ["getGroupName"]),
    ...mapGetters(["getIsAdmin", "getUserDevices"]),
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
    ...mapActions(["genEmail", "request", "closeDialog"]),
    removeUser() {
      this.loading = true;
      this.request({
        method: "DELETE",
        url: "users/remove",
        data: { id: this.data._id }
      })
        .then(() => {
          this.loading = false;
          this.closeDialog();
        })
        .catch(() => {
          this.loading = false;
          this.closeDialog();
        });
    },
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
