import axios from "axios";
import Vue from "vue";
import router from "./../router";
if (process.env.NODE_ENV == "development") {
  axios.defaults.baseURL = "http://localhost:7070/v1/";
} else {
  axios.defaults.baseURL = "https://schemeapi.herokuapp.com/v1/";
}

const sortPayload = ({ state, getters }, payload) => {
  const token = state.token;
  if (token) {
    payload.headers = {
      authorisation: token,
      version: getters.getCurrentVersion
    };
  }
  return payload;
};

const exitApplication = (context, networkError = false, logout = false) => {
  context.commit("DELETE_GLOBAL_INTERVAL");
  if (networkError) {
    context.commit("UPDATE_NETWORK_ERROR", true);
  }
  if (logout && context.state.userInformation?._id) {
    context.dispatch("logOut");
  }
};

export default {
  async logOut(context) {
    await context.dispatch("request", {
      method: "GET",
      url: "users/logout",
      data: { _id: context.state.userInformation._id }
    });
    if (router.currentRoute.name != "signIn") {
      router.push({ name: "signIn" });
    }
    context.commit("DELETE_USER_SESSION");
    context.commit("DELETE_GLOBAL_INTERVAL");
    context.commit("UPDATE_STOP_NOTIFICATIONS", true);
  },
  /**
   *
   * @param {*} context
   * @param {Object} params
   */
  genPromptBox(context, { boxType, text, title, type, confirm }) {
    return new Promise((resolve, reject) => {
      boxType ? boxType : "confirm";
      confirm ? confirm : "Yes";
      Vue.prototype[`$${boxType}`](text, title, {
        confirmButtonText: confirm,
        cancelButtonText: "Cancel",
        type,
        round: true
      })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  async genApiNotification(context, notificationContent) {
    try {
      return console.log(notificationContent);
      let response = context.dispatch("request", {
        method: "POST",
        url: "extensions/notification",
        data: notificationContent
      });
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  /**
   * 
        to: "adenaikeyomi@gmail.com",
        subject: "even diff Contact",
        context: {
          test: "Hello from the render",
          body (optional) :"""
          footer (optional) :""
        }
   */
  genEmail(context, emailContent) {
    emailContent.to == "all"
      ? (emailContent.to = context.state.admin.team.map(member => {
          return member.email;
        }))
      : emailContent.to;

    return new Promise((resolve, reject) => {
      context
        .dispatch("request", {
          method: "POST",
          url: "extensions/send",
          data: emailContent
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  request(context, payload) {
    payload = sortPayload(context, payload);

    let enableNotifications = true;

    if (
      payload?.disableNotification ||
      context.state.networkError ||
      context.state.stopNotifications
    ) {
      enableNotifications = false;
    }

    const handleError = error => {
      const status = error?.request?.status;

      // Web token error
      if (status === 401 || typeof error == "object") {
        return exitApplication(context, false, true);
      }

      if (error?.data) {
        error = error.data.content;
      }
      if (enableNotifications) {
        context.commit("CREATE_SYSTEM_NOTIFICATION", {
          message: error,
          type: "error"
        });
      }
      // exitApplication(context, true);
    };
    return new Promise((resolve, reject) => {
      axios(payload)
        .then(response => {
          response = response.data;
          if (response?.success) {
            if (typeof response.content == "string" && enableNotifications) {
              context.commit("CREATE_SYSTEM_NOTIFICATION", {
                message: response.content,
                type: "success"
              });
            }
            resolve(response.content);
          }
          if (response?.error) {
            handleError(response.content);
            reject(response.content);
          }
        })
        .catch(error => {
          handleError(error);
          reject(error);
        });
    });
  }
};
