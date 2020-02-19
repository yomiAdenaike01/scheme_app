<template>
  <div ref="notification" class="notification_container m-3" v-loading="loading">
    <el-badge
      :value="makePretty(notification.status) "
      :type="notification.status == 'read' ? 'success' : 'danger'"
    >
      <p class="bold">{{ `${truncate(notification.message, 20)}.` }}</p>
      <small class="grey">{{ notificationSendDate }}</small>
    </el-badge>
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
      loading: false
    };
  },
  computed: {
    notificationSendDate() {
      return this.calendar(this.notification.dateCreated);
    },
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
      this.loading = true;
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
          this.loading = false;
        });
    },
    async updateContent() {
      this.loading = true;
      this.request(this.notificationRequestBody)
        .then(response => console.log(response))
        .catch(error => console.log(error));
      this.changeNotificationActionToComplete();
      this.loading = false;
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
.notification_container {
  cursor: pointer;
  &:hover {
    background: $hover_grey;
  }
}
</style>
