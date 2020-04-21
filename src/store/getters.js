import { guide } from "@/stubs/guide";
import UAParser from "ua-parser-js";

const genUUID = require("uuid-by-string");

export default {
  getUA() {
    return new UAParser();
  },
  getCurrentTabXref: () => ({ tabs, currentTab }) => {
    let tabLabel = tabs[currentTab].label;
    return {
      name: tabLabel.replace(/\s/g, "_").toLowerCase(),
      display: tabLabel
    };
  },

  getCurrentVersion() {
    return require("../../package.json").version;
  },
  getIsIE(state, { getUA }) {
    return getUA.getBrowser().name == "IE";
  },

  getActiveDialog: ({ dialogIndex }) => dialogName => {
    let foundDialog = null;
    if (dialogName) {
      foundDialog = dialogIndex[dialogName];
    } else {
      for (let property in dialogIndex) {
        if (dialogIndex[property].view) {
          foundDialog = dialogIndex[property];
        }
      }
    }
    return foundDialog;
  },

  getDeviceInformation(state, { getUA }) {
    return {
      system: getUA.getOS(),
      id: genUUID(window.navigator.userAgent.toString().trim())
    };
  },

  getClient({ clientInformation }, { isValidClient }) {
    if (isValidClient) {
      return clientInformation;
    } else {
      return {};
    }
  },

  getIsAdmin({ userInformation: { userGroup } }) {
    if (userGroup) {
      return userGroup.label.toLowerCase() == "system administrator";
    } else {
      return false;
    }
  },

  getGuide() {
    return guide;
  },
  getDefaultColour({ defaultCustomColours }) {
    return defaultCustomColours[0];
  },
  genRandomID() {
    return genUUID(
      Math.random()
        .toString(16)
        .slice(2)
    );
  }
};
