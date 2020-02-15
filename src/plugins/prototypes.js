import Vue from "vue";

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
    } else if (Array.isArray(elem)) {
      return elem.length > 0;
    } else {
      throw new Error(`Element must be an object or array not ${typeof elem}.`);
    }
  } else {
    return false;
  }
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
