<template>
  <div ref="notification" v-loading="globalLoader">
    <el-row
      class="p-3 m-1"
      style="width:100%;border-left:2px solid rgb(220,220,220);"
    >
      <el-col style="width:100%; ">
        <el-row
          type="flex"
          align="middle"
          v-if="notification.status != 'complete'"
        >
          <el-col>
            <span style="font-size:.8em">{{ `${notification.message}.` }}</span>
          </el-col>

          <el-col
            style="flex:1;display:flex; justify-content:center; align-items:center; flex-direction:column"
          >
            <el-button
              plain
              type="danger"
              size="small"
              class="m-0"
              style="width:100%"
              @click="deleteNotifcation"
              >Delete Notification</el-button
            >
            <el-button
              size="small"
              class="m-0"
              style="width:100%"
              type="primary"
              plain
              v-if="notification.type == 'approve'"
              @click="viewDetails = !viewDetails"
              >Approve / Reject</el-button
            >
          </el-col>
        </el-row>
        <!-- NOTIFICATION ACTION IS COMPLETE -->
        <el-row v-else type="flex" align="center">
          <el-col
            style="display:flex; justify-content:space-between; align-items:center"
          >
            <span style="font-size:.8em">{{ `${notification.message}.` }}</span>
            <el-button
              disabled
              size="small"
              icon="el-icon-check"
              type="success"
              circle
            ></el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-collapse-transition>
        <el-col
          v-if="viewDetails && notification.status != 'complete'"
          class="p-3 mt-3"
          style=" color:#444"
        >
          <p style="text-align:center; font-size:.8em">
            Please confirm that you want to approve these changes
          </p>
          <div class="update_content p-3">
            {{ notificationUpdate }}
            <!-- <p class="mb-1" v-for="(prop, index) in notificationUpdate" :key="index">
            <span class="member_name">{{ index.toLowerCase() }}:</span>
            {{ prop }}
            </p>-->
            <div class="flex_container" style="display:flex;">
              <el-button
                class="mt-4"
                plain
                type="success"
                icon="el-icon-check"
                size="small"
                @click="updateContent"
              ></el-button>
              <el-button
                plain
                class="mt-4"
                icon="el-icon-close"
                size="small"
                type="danger"
                @click="updateContent"
              ></el-button>
            </div>
          </div>
        </el-col>
      </el-collapse-transition>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import dates from "@/mixins/dates";
export default {
  name: "Notification",
  mixins: [dates],
  data() {
    return {
      viewDetails: false,
      formatString: "DD/MMMM/YYYY HH:mm",
      globalLoader: false
    };
  },
  computed: {
    startDate() {
      return this.format(this.update.startDate, this.formatString);
    },
    endDate() {
      return this.format(this.update.endDate, this.formatString);
    },
    notificationUpdate() {
      return this.notification.content;
    },
    notificationRequestBody() {
      return this.notification.requestBody;
    }
  },
  props: {
    notification: Object
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_USER_NOTIFICATIONS"]),
    sendNotificationToRequster() {
      let requester = this.notification.requested_by;
      let payload = {
        method: "POST",
        url: "notifications/create",
        data: {
          for: requester,
          type: "display",
          message: "Your request has been approved"
        }
      };
      this.request(payload)
        .then(response => {
          return response;
        })
        .catch(error => {
          return error;
        });
    },
    changeNotificationActionToComplete() {
      this.request({
        method: "POST",
        url: "/notifications/update",
        data: {
          id: this.notification._id,
          update: { status: "complete" }
        }
      })
        .then(response => this.sendNotificationToRequster())
        .catch(error => console.log(error));
    },
    deleteNotifcation() {
      this.globalLoader = true;
      this.request({
        method: "DELETE",
        url: "/notifications/one",
        data: {
          id: this.notification._id
        }
      })
        .then(response => {
          this.UPDATE_USER_NOTIFICATIONS(null);
        })
        .catch(error => {
          this.globalLoader = false;
        });
    },
    async updateContent() {
      this.globalLoader = true;
      this.request(this.notificationRequestBody)
        .then(response => console.log(response))
        .catch(error => console.log(error));
      this.changeNotificationActionToComplete();
      this.globalLoader = false;
    }
  }
};
</script>
<style lang="scss">
.update_content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 0.8em;
}
.check_button {
  border: 1px solid $element_colour;
  .el-icon-check {
    color: $element_colour;
  }
}
</style>
