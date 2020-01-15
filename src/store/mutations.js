import storage from "./storage";
import sounds from "@/mixins/playSound";
const SET_THEME = () => {
  let id = "chalk-style";
  let styleTag = document.getElementById(id);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.setAttribute("id", id);
    document.head.appendChild(styleTag);
  }
};
const getCSSString = (url, variable) => {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        variable = xhr.responseText.replace(/@font-face{[^}]+}/, "");
        resolve();
      }
    };
    xhr.open("GET", url);
    xhr.send();
  });
};
const getThemeCluster = theme => {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    if (tint === 0) {
      // when primary color is in its rgb space
      return [red, green, blue].join(",");
    } else {
      red += Math.round(tint * (255 - red));
      green += Math.round(tint * (255 - green));
      blue += Math.round(tint * (255 - blue));
      red = red.toString(16);
      green = green.toString(16);
      blue = blue.toString(16);
      return `#${red}${green}${blue}`;
    }
  };
  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    red = Math.round((1 - shade) * red);
    green = Math.round((1 - shade) * green);
    blue = Math.round((1 - shade) * blue);
    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);
    return `#${red}${green}${blue}`;
  };
  const clusters = [theme];
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
  }
  clusters.push(shadeColor(theme, 0.1));
  return clusters;
};

const updateStyle = (style, oldCluster, newCluster) => {
  let newStyle = style;
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index]);
  });
  return newStyle;
};

export default {
  async UPDATE_THEME(state, val) {
    val = state.client.company_colours ? state.client.company_colours : val;
    console.log(val);
    const ORIGINAL_THEME = "#409EFF"; // default color
    const version = require("element-ui/package.json").version;

    const oldVal = val || ORIGINAL_THEME;
    if (typeof val !== "string") return;
    const themeCluster = getThemeCluster(val.replace("#", ""));
    const originalCluster = getThemeCluster(oldVal.replace("#", ""));
    const getHandler = (variable, id) => {
      return () => {
        const originalCluster = getThemeCluster(
          ORIGINAL_THEME.replace("#", "")
        );
        const newStyle = updateStyle(
          this[variable],
          originalCluster,
          themeCluster
        );
        SET_THEME(newStyle);
      };
    };
    if (!this.chalk) {
      const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
      await getCSSString(url, "chalk");
    }
    const chalkHandler = getHandler("chalk", "chalk-style");
    chalkHandler();
    const styles = [].slice
      .call(document.querySelectorAll("style"))
      .filter(style => {
        const text = style.innerText;
        return (
          new RegExp(oldVal, "i").test(text) && !/Chalk Variables/.test(text)
        );
      });
    styles.forEach(style => {
      const { innerText } = style;
      if (typeof innerText !== "string") return;
      style.innerText = updateStyle(innerText, originalCluster, themeCluster);
    });

    // localStorage.setItem("cssText", payload);
  },
  UPDATE_CLIENT(state, payload) {
    state.client = payload;
  },
  UPDATE_UPLOAD_TIMESHEET(state, payload) {
    state.weeklyTimesheetUploaded = payload;
  },
  UPDATE_DEFAULT_FONT(state, payload) {
    state.defaultSize = { minFontSize: payload.min, maxFontSize: payload.max };
  },
  UPDATE_TOGGLE_MOBILE_MENU(state, payload) {
    state.viewMobileMenu = payload;
  },
  UPDATE_USER_NOTIFICATIONS(state, payload) {
    state.userNotifications = payload;
  },
  UPDATE_VIEW_NOTIFICATIONS_CENTER(state, payload) {
    state.viewNotificationsCenter = payload;
  },
  UPDATE_SETTINGS(state, { category, key, value }) {
    state.localSettings[category][key] = value;
  },
  UPDATE_GLOBAL_LOADER(state, payload) {
    state.globalLoader = payload;
  },
  REMOVE_USER(state) {
    state.currentUser = {};
    state.token = {};
    localStorage.clear();
    document.getElementById("chalk-style").remove();
  },
  UPDATE_USER(state, payload) {
    state.currentUser = payload.user;
    state.token = payload.token;
    storage.set("token", payload.token);
    storage.set("currentUser", payload.user);
  },
  UPDATE_HAS_SEEN_NOTIFICATIONS(state, payload) {
    state.hasSeenNotifications = payload;
  },
  UPDATE_NOTIFICATIONS(state, notification) {
    if (notification.type == "success") {
      notification.title = "Opeartion Successful";
      sounds.methods.playSuccessSound();
    } else if (notification.type == "error") {
      notification.title = "Operation Unsuccessful";
      sounds.methods.playErrorSound();
    } else if (notification.message == "network error") {
      state.critical_network_error = true;
    }
    state.notifications.unshift(notification);
  }
};
