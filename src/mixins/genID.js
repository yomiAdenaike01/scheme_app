export default {
  methods: {
    genID() {
      return require("bson-objectid")().toString();
    }
  }
};
