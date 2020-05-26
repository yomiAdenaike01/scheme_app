<template>
  <div v-loading="loading" class="notifications_container">
    <div v-if="apiNotifications.length > 0" class="notifications">
      <!-- Api notifications -->
      <div
        v-for="notification in apiNotifications"
        :key="notification._id"
        :class="`notification trigger ${notification.type}`"
      >
        <i :class="`bx ${iconXref(notification.type)}`"></i>
        <div class="notification_body_container">
          <p>{{ notification.message }}</p>
          <small class="grey">{{
            initMoment(notification.date_created).calendar()
          }}</small>
          <i
            class="bx bx-x trigger"
            @click="deleteNotification(notification._id)"
          ></i>
        </div>
      </div>
    </div>
    <div v-else class="text_container all_centre">
      <i class="bx bx-bell"></i>
      <h3>No notifications found</h3>
      <p>Your notifications will appear here.</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import Notification from "./components/Notification";

export default {
  name: "Notifications",
  components: {
    Notification
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState(["apiNotifications", "userInformation", "notificationRef"])
  },

  methods: {
    ...mapActions(["request"]),

    iconXref(type) {
      let ref = {
        message: "bxl-discourse",
        request: "bx-question-mark"
      };
      return ref[type];
    }
  }
};
</script>

<style lang="scss" scoped>
$notification_ref: (
  message: var(--colour_secondary),
  request: var(--purple)
);
.notifications_container {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 450px;
  max-height: 450px;
}
.notifications {
  max-height: calc(100% - 75px);
  overflow-x: hidden;
}
.notification {
  border-bottom: $border;
  padding: 14px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  p {
    margin: 0;
  }
  i {
    font-size: 1.7em;
    margin-right: 20px;
  }
  @each $key, $value in $notification_ref {
    &.#{$key} {
      border-left: 3px solid rgba($value, 1);
      i {
        color: rgba($value, 1);
      }
    }
  }
  &:hover {
    opacity: 1;
  }
}
.mark_all_wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.block_button {
  width: 100%;
}
.text_container .bx {
  font-size: 2em;
  margin-bottom: 10px;
}
.text_container p {
  margin: 0;
}
</style>
