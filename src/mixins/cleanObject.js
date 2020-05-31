export default {
  methods: {
    cleanObject(excludeProperties, object, include = false) {
      let returnObject = {};

      for (let property in object) {
        if (!include) {
          if (excludeProperties.indexOf(property) == -1) {
            returnObject[property] = object[property];
          }
        } else {
          if (excludeProperties.indexOf(property) > -1) {
            returnObject[property] = object[property];
          }
        }
      }

      return returnObject;
    }
  }
};
