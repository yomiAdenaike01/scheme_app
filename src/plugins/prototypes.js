import Vue from "vue";
import moment from "moment";
function checkType(elem, determinedType) {
  if (typeof elem != undefined && typeof elem != determinedType) {
    throw new Error(`Element type is wrong ${typeof elem}.`);
  } else {
    return true;
  }
}

Vue.prototype.hasEntries = function(elem) {
  if (typeof elem != undefined) {
    if (typeof elem == "object") {
      return Object.keys(elem).length > 0;
    }
    if (Array.isArray(elem) || typeof elem == "string") {
      return elem.length > 0;
    }
  } else {
    return false;
  }
};

Vue.prototype.hasObjVals = function(elem) {
  return Object.values(elem).length > 0;
};

Vue.prototype.makePretty = function(elem) {
  if (checkType(elem, "string")) {
    return elem.replace("_", " ");
  }
};

Vue.prototype.makeUgly = function(elem) {
  if (checkType(elem, "string")) {
    return elem.replace(" ", "_").toLowerCase();
  }
};
Vue.prototype.truncate = function(elem, len) {
  if (!len) {
    len = 10;
  }
  if (checkType(elem, "string")) {
    return elem.length > len ? `${elem.substr(0, len)} ...` : elem;
  }
};

Vue.prototype.initMoment = function(date = new Date()) {
  return moment(date);
};
Vue.prototype.formatDate = function(date, formatString = "DD/MM/YYYY HH:mm") {
  return moment(date).format(formatString);
};
Vue.prototype.arrIncludes = function(arr, item, displayIndex = true, key = "") {
  let res;
  if (!displayIndex) {
    res = arr.some(arrItem => arrItem == item);
  } else {
    res = arr.findIndex(arrItem => {
      return arrItem[key] == item;
    });
  }
  return res;
};
