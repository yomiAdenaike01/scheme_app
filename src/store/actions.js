import axios from "axios";
import Vue from "vue";

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
  context.dispatch("closeOverlay");
  if (networkError) {
    context.commit("UPDATE_NETWORK_ERROR", true);
  }
  if (logout) {
    context.commit("DELETE_USER");
  }
};

export default {
  restoreOverlay(context) {
    context.commit("UPDATE_OVERLAY_INDEX", context.state.overlayHistory);
  },
  updateDevices(context) {
    return new Promise((resolve, reject) => {
      context
        .dispatch("request", {
          method: "POST",
          url: "users/devices",
          data: { device: context.getters.getDeviceInformation }
        })
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  closeOverlay({ getters, state, commit }, name = "") {
    commit(
      "UPDATE_OVERLAY_INDEX",
      {
        view: false,
        overlay: name,
        data: null
      },
      { root: true }
    );
    if (!name) {
      let activeOverlay = getters.getActiveOverlay()?.name;
      console.log(activeOverlay);
      if (activeOverlay) {
        commit("UPDATE_OVERLAY_INDEX", {
          view: false,
          data: null,
          overlay: activeOverlay
        });
      }
    }
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

  genApiNotification(context, notificationContent) {
    return new Promise((resolve, reject) => {
      context
        .dispatch("request", {
          method: "POST",
          url: "extensions/notification",
          data: notificationContent
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
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

    if (payload?.disableNotification) {
      enableNotifications = false;
    }
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
          } else if (response?.error) {
            reject(response.content);
          }
        })
        .catch(error => {
          const status = error?.request?.status;
          // Web token error
          if (status === 401) {
            exitApplication(context, false, true);
          }
          console.error(error);
          if (error?.data) {
            error = error.data.content;
          }
          if (enableNotifications) {
            context.commit("CREATE_SYSTEM_NOTIFICATION", {
              error,
              type: "error"
            });
          }
          exitApplication(context, true);
          reject(error);
        });
    });
  }
};
