import axios from "axios";
import Vue from "vue";

if (process.env.NODE_ENV == "development") {
  axios.defaults.baseURL = "http://localhost:7070/v1/";
} else {
  axios.defaults.baseURL = "https://dev-schemapi.now.sh/v1/";
}

const sortPayload = (state, payload) => {
  const token = state.token;
  if (token) {
    payload.headers = { authorisation: token };
  }
  return payload;
};

export default {
  closeDialog(context, name) {
    context.commit(
      "UPDATE_DIALOG_INDEX",
      {
        view: false,
        dialog: name ? name : "",
        data: null
      },
      { root: true }
    );
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
  checkServerHealth(context) {
    context
      .dispatch("request", {
        method: "GET",
        url: "/healthcheck"
      })
      .then(response => {
        context.commit("UPDATE_SERVER_HEALTH_STATUS", response);
      })
      .catch(error => {
        return error;
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
      ? (emailContent.to = context.admin.state.teamInformation.map(member => {
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
    payload = sortPayload(context.state, payload);

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
        const { status } = error.request;

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
