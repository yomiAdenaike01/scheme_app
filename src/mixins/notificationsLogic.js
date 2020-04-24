export default {
  methods: {
    sortNotification(notification) {
      switch (notification.type) {
        case "message": {
          notification.icon = "message-rounded";
          notification.title = `${notification.sentFrom.name} says....`;
          let routerPayload = {
            name: "comms",
            params: { chatID: notification?.data?.chatID }
          };
          if (!routerPayload.params.chatID) {
            delete routerPayload.params;
          }
          notification.onclick = () => {
            this.$router.push(routerPayload);
          };
          break;
        }
        case "announcement": {
          notification.icon = "bx-user-voice";
          notification.title = "Announcement";
          break;
        }
        case "request": {
          notification.title = this.truncate(
            `New request from ${notification.sentFrom.name}`
          );
          notification.icon = "bx-question-mark";
          break;
        }

        default: {
          break;
        }
      }
      return notification;
    }
  }
};
