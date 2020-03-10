<template>
  <div
    ref="notification"
    class="notification_container pl-2 pr-2"
    :class="{
      is_read:
        notification.status == 'is_read' || notification.status == 'complete'
    }"
    v-loading="loading"
    @click="updateNotification({ status: 'is_read' }), notificationController()"
  >
    <p class="flex" :title="notification.message">
      <i :class="notificationTypeIcon" class="grey notification_icon mr-2"></i>
      {{ notification.message }}
    </p>
    <small class="grey mt-3 mb-3">{{ notificationSendDate }}</small>

    <br />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  name: "Notification",
  data() {
    return {
      viewDetails: false,
      formatString: "DD/MMMM/YYYY HH:mm",
      loading: false
    };
  },
  computed: {
    notificationSendDate() {
      return this.initMoment(this.notification.dateCreated).calendar();
    },
    startDate() {
      return this.formatDate(this.update.startDate, this.formatString);
    },
    endDate() {
      return this.formatDate(this.update.endDate, this.formatString);
    },
    notificationUpdate() {
      return this.notification.content;
    },
    notificationRequestBody() {
      return this.notification.requestBody;
    },
    notificationTypeIcon() {
      let type = "";
      switch (this.notification.type) {
        case "message": {
          type = "bx bx-conversation";
          break;
        }

        case "attention": {
          type = "bx bx-exclamation";
          break;
        }

        case "announcement": {
          type = "bx bx-speaker";
          break;
        }

        default:
          break;
      }
      return type;
    }
  },
  props: {
    notification: Object
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_USER_NOTIFICATIONS"]),

    notificationController() {
      let notification = this.notification;

      switch (notification.type) {
        case "message": {
          this.$router.push({
            name: "messenger",
            params: { id: notification.content.id }
          });
          break;
        }

        case "request": {
          this.$router.push({ name: "events" });
          break;
        }

        default:
          break;
      }
    },
    updateNotification(update) {
      this.loading = true;
      this.request({
        method: "POST",
        url: "notifications/update",
        data: {
          id: this.notification._id,
          update
        }
      })
        .then(response => {
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
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
.notification_icon {
  font-size: 1.5em;
}
</style>
