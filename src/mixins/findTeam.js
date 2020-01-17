import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("Admin", ["team"])
  },
  methods: {
    findTeamMember(id) {
      return this.team.find(member => {
        return member._id == id;
      });
    }
  }
};
