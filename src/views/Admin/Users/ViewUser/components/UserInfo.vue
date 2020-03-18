<template>
  <div class="user_info_container" v-loading="loading">
    <div class="flex flex--end align-center">
      <el-button round @click="requestgenEmail">Contact</el-button>
      <Popover trigger="click">
        <el-button slot="trigger" v-if="getIsAdmin" round>{{
          data.groupID == 0 ? "Assign to group" : "Reassign to group"
        }}</el-button>
        <el-select
          slot="content"
          @change="assignUserToGroup"
          v-model="selectedGroup"
        >
          <el-option
            v-for="group in getUserGroups"
            :label="group.label"
            :value="group.value"
            :key="group.value"
          >
          </el-option>
        </el-select>
      </Popover>
      <el-button type="danger" plain v-if="getIsAdmin" round @click="removeUser"
        >Delete Account</el-button
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
import Popover from "@/components/Popover";
export default {
  name: "UserInfo",
  data() {
    return {
      selectedGroup: "",
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
    ...mapGetters("Admin", ["getGroupName", "getUserGroups"]),
    ...mapGetters(["getIsAdmin", "getUserDevices"]),
    date() {
      return this.formatDate(this.data.dateCreated);
    },
    group() {
      return this.getGroupName("event", this.data.groupID)?.name;
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
    assignUserToGroup() {
      this.loading = true;
      this.request({
        method: "PUT",
        url: "users/update",
        data: { update: { _id: this.data._id, groupID: this.selectedGroup } }
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
    removeUser() {
      this.loading = true;
      this.request({
        method: "DELETE",
        url: "users/remove",
        data: { _id: this.data._id }
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
  },
  components: {
    Popover
  }
};
</script>

<style lang="scss" scoped>
.user_info_container {
  line-height: 2em;
}
</style>
