export default {
  data() {
    return {
      url: window.location.host.split(".")
    };
  },
  methods: {
    refactorWindowLocation(clientname) {
      let refactoredLocation = `${
        window.location.protocol
      }//${clientname}.${window.location.host.replace(`${this.url[0]}.`, "")}`;
      window.location.replace(refactoredLocation);
    }
  }
};
