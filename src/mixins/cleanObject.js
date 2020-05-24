export default {
  methods: {
    cleanObject(excludeProperties, object) {
      let returnObject = {};

      for (let property in object) {
        if (excludeProperties.indexOf(property) == -1) {
          returnObject[property] = object[property];
        }
      }

      return returnObject;
    }
  }
};
