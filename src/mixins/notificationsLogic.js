export default {
  methods: {
    sortNotification(notification) {
      let notificationTypes = [
        "success",
        "error",
        "warning",
        "message",
        "annoucement",
        "info"
      ];
      notification.showClose = true;
      notification.dangerouslyUseHTMLString = true;

      if (notificationTypes.indexOf(notification.type) == -1) {
        notification.type = "info";
      }

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

      if (notification?.icon) {
        notification.iconClass = `custom_notification_icon bx bx-${notification.icon} bx-tada`;
        delete notification.type;
      }

      if (notification.type == "success" && !notification.title) {
        notification.title = "Operation Successful";
      } else if (notification.type == "error" && !notification.title) {
        notification.title = "Operation Unsuccessful";

        if (typeof notification.message == "object") {
          state.criticalNetworkError = true;
          state.errorInformation = notification.message;

          if (VueRouter.currentRoute.name != "error") {
            VueRouter.push({ name: "error" });
          }
        }
      }

      if ("desktop" in notification) {
        //  params:  // 'To do list', { body: text, icon: img }
        let desktopNotification;
        let desktop = notification.desktop;
        let { content, title } = desktop;
        desktopNotification = new Notification(title, content);
        if ("click" in desktop) {
          desktopNotification.onclick = () => {
            desktop.click();
          };
        }
      }

      return notification;
    }
  }
};
