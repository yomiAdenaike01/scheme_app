import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("Admin", ["teamInformation"])
  },
  methods: {
    findTeamMember(id) {
      return this.teamInformation.find(member => {
        return member._id == id;
      });
    }
  }
};
