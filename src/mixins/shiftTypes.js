import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["shiftTypes"])
  },
  methods: {
    returnShiftTypes(toRemove, property) {
      const types = this.shiftTypes;
      let { employeeType } = this.userInformation;

      let _types = [];
      const len = types.length;

      for (let i = 0; i < len; i++) {
        let { name, value } = types[i];

        if (toRemove) {
          if (value == toRemove) {
            continue;
          }
        }

        if (value == 2 && employeeType != 2) {
          continue;
        }

        _types.push({
          name,
          [property]: value
        });
        
      }
      return _types;
    }
  }
};
