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

export default {
  updateDevices(context) {
    return new Promise((resolve, reject) => {
      context
        .dispatch("request", {
          method: "POST",
          url: "users/devices",
          data: { device: context.getters.getDeviceID }
        })
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  getClient(context) {
    return new Promise((resolve, reject) => {
      let currentHostname = window.location.hostname.toString().split(".");
      let subdomain = currentHostname[0];
      let domain = currentHostname[1];
      // if (subdomain.length <= 0) {
      context
        .dispatch("request", {
          method: "GET",
          url: "clients/get",
          params: { subdomain }
        })

        .then(response => {
          context.commit("UPDATE_CLIENT", response);
          resolve(response);
        })
        .catch(error => {
          context.commit("UPDATE_INVALID_CLIENT", {
            display: true,
            error: true
          });
          reject(error);
        });
    });
  },
  closeDialog({ commit, state: { dialogIndex } }, name = "") {
    commit(
      "UPDATE_DIALOG_INDEX",
      {
        view: false,
        dialog: name,
        data: null
      },
      { root: true }
    );

    if (!name) {
      for (let property in dialogIndex) {
        console.log(dialogIndex[property]);
        if (dialogIndex[property].view == true) {
          commit("UPDATE_DIALOG_INDEX", {
            view: false,
            dialog: property,
            data: null
          });
        }
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

  updateTheme(context, content) {
    context.dispatch("request", {
      method: "POST",
      url: "clients/update",
      data: { update: content }
    });
  },

  updateSettings(context) {
    return new Promise((resolve, reject) => {
      context
        .dispatch("request", {
          method: "POST",
          url: "settings/update",
          data: context.state.localSettings
        })
        .then(response => {
          context.commit("UPDATE_NOTIFICATIONS", response);
          resolve(response);
        })
        .catch(error => {
          context.commit("UPDATE_NOTIFICATIONS", error);
          reject(error);
        });
    });
  },

  genNotification(context, notificationContent) {
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
  genEmail(
    {
      admin: {
        state: { teamInformation }
      }
    },
    emailContent
  ) {
    emailContent.to == "all"
      ? (emailContent.to = teamInformation.map(member => {
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

    if (payload.hasOwnProperty("disableNotification")) {
      enableNotifications = false;
    }

    return axios(payload)
      .then(response => {
        response = response.data;

        if (response.hasOwnProperty("success")) {
          if (typeof response.content == "string" && enableNotifications) {
            context.commit("UPDATE_NOTIFICATIONS", {
              message: response.content,
              type: "success"
            });
          }
          return Promise.resolve(response.content);
        } else if (response.hasOwnProperty("error")) {
          return Promise.reject(response.content);
        }
      })
      .catch(error => {
        const status = error?.request?.status;

        // Web token error
        if (status === 401) {
          context.commit("UPDATE_NOTIFICATIONS", {
            message:
              "Your session has expired, you will need to login click to refresh",
            type: "info"
          });
          context.commit("REMOVE_USER");
        }

        if (error.hasOwnProperty("data")) {
          error = error.data.content;
        }
        if (enableNotifications) {
          context.commit("UPDATE_NOTIFICATIONS", {
            message: error,
            type: "error"
          });
        }
        return Promise.reject(error);
      });
  }
};
