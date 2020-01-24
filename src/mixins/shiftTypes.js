import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["currentUser"]),
    ...mapState("Admin", ["shiftTypes"])
  },
  methods: {
    returnShiftTypes(toRemove, property) {
      const shiftTypes = this.shiftTypes;
      let { employee_type } = this.currentUser;

      let _shiftTypes = [];
      const len = shiftTypes.length;

      for (let i = 0; i < len; i++) {
        let { name, value } = shiftTypes[i];
        if (value == toRemove) {
          continue;
        }

        if (value == 2 && employee_type != 2) {
          continue;
        }

        _shiftTypes.push({
          name,
          [property]: value
        });
      }
      return _shiftTypes;
    }
  }
};
