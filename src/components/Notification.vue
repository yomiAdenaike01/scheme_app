<template>
  <div
    ref="notification"
    class="notification_container pl-2 pr-2"
    :class="{
      is_read:
        notification.status == 'is_read' || notification.status == 'complete'
    }"
    v-loading="loading"
    @click="updateNotification({ status: 'is_read' })"
  >
    <p :title="notification.message">{{ notification.message }}</p>
    <small class="grey mt-3 mb-3">{{ notificationSendDate }}</small>

    <div
      v-if="notification.status != 'is_read'"
      :class="['notification_type_indicator', notification.type]"
    >
      <small>{{ makePretty(notification.type) }}</small>
    </div>
    <br />
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
    updateNotification(update) {
      this.request({
        method: "POST",
        url: "notifications/update",
        data: {
          id: this.notification._id,
          update
        }
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateContent() {
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
  border-bottom: $border;
  &.is_read {
    opacity: 0.5;
    pointer-events: none;
  }
  &:hover {
    background: $hover_grey;
    .actions_wrapper {
      opacity: 1;
      visibility: visible;
    }
  }
}
.actions_wrapper {
  opacity: 0;
  visibility: hidden;
}
.notification_type_indicator {
  border-radius: 20px;
  color: white;
  text-transform: capitalize;
  max-width: 80px;
  text-align: center;
  padding: 3px 10px;
  margin-top: 5px;
  &.reminder {
    background: rgb(94, 114, 228);
  }
  &.request {
    background: rgb(45, 206, 137);
  }
  &.attention {
    background: rgb(251, 99, 64);
  }
}
</style>
