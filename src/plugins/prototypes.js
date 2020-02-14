import Vue from "vue";

Vue.prototype.hasValues = function(elem) {
  if (typeof elem == "object") {
    return Object.keys(elem).length > 0;
  } else if (Array.isArray(elem)) {
    return elem.length > 0;
  } else {
    throw new Error(`Element must be an object or array not ${typeof elem}.`);
  }
};

Vue.prototype.makePretty = function(elem) {
  if (typeof elem != "string") {
    throw new Error(`Element must be a string not ${typeof elem}.`);
  }

  return elem.replace("_", " ");
};
