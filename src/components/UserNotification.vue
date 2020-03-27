<template>
  <div
    ref="notification"
    v-loading="loading"
    class="notification_container"
    :class="{
      is_read:
        notification.status == 'is_read' || notification.status == 'complete'
    }"
    @click="updateNotification({ status: 'is_read' }), notificationController()"
  >
    <p class="flex" :title="notification.message">
      <i :class="notificationTypeIcon" class="grey notification_icon"></i>
      {{ notification.message }}
    </p>
    <small class="grey">{{ notificationSendDate }}</small>

    <br />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  name: "UserNotification",
  props: {
    notification: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      viewDetails: false,
      loading: false
    };
  },
  computed: {
    notificationSendDate() {
      return this.initMoment(this.notification.dateCreated).calendar();
    },
    startDate() {
      return this.formatDate(this.update.startDate);
    },
    endDate() {
      return this.formatDate(this.update.endDate);
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
      this.UPDATE_USER_NOTIFICATIONS({ _id: this.notification._id, update });
      this.request({
        method: "POST",
        url: "notifications/update",
        data: {
          _id: this.notification._id,
          update
        }
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss">
.update_content {
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 0.8em;
  justify-content: center;
}
.check_button {
  border: 1px solid $element_colour;
  .el-icon-check {
    color: $element_colour;
  }
}
.notification_container {
  border-bottom: $border;
  cursor: pointer;
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
  margin-top: 5px;
  max-width: 80px;
  padding: 3px 10px;
  text-align: center;
  text-transform: capitalize;
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
