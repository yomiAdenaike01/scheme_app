import axios from "axios";
import Vue from "vue";
import router from "./../router";
import generateID from "@/mixins/genID";
import axiosCancel from "axios-cancel";

axiosCancel(axios, {
  debug: false
});

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
    payload.requestID = generateID.methods.genID();
  }
  return payload;
};

const exitApplication = (context, networkError = false, logout = false) => {
  context.commit("DELETE_GLOBAL_INTERVAL");
  if (networkError) {
    context.commit("UPDATE_NETWORK_ERROR", true);
    axios.cancelAll();
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
    axios.cancelAll();
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

  async notify(context, notificationContent) {
    try {
      notificationContent.sent_from = context.state.userInformation._id;

      let response = await context.dispatch("request", {
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
  async request(context, payload) {
    payload = sortPayload(context, payload);

    let enableNotifications = true;

    let disableNotificationCondition =
      payload?.disableNotification ||
      context.state.networkError ||
      context.state.stopNotifications;

    if (disableNotificationCondition) {
      enableNotifications = false;
    }

    const handleError = async error => {
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
      return Promise.reject(error);
    };
    try {
      let response = await axios(payload);
      response = response.data;

      if (response?.success) {
        if (typeof response.content == "string" && enableNotifications) {
          context.commit("CREATE_SYSTEM_NOTIFICATION", {
            message: response.content,
            type: "success"
          });
        }

        return Promise.resolve(response.content);
      }

      if (response?.error) {
        handleError(response.content);
        return Promise.reject(response.content);
      }
    } catch (error) {
      handleError(error);
    }
  }
};
