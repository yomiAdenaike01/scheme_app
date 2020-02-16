<template>
  <el-dialog :visible.sync="computeDisplay">
    <Title title="View Event" subtitle="Click on more information to display details">
      <MoreInformation index="admin" instruction="view_event" />
    </Title>
    <p>{{event}}</p>

  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import Title from "@/components/Title";
import MoreInformation from "@/components/MoreInformation";
import moment from "moment";
import Dropdown from "@/components/Dropdown";
export default {
  name: "ViewEventDialog",
  data() {
    return {
      loading: false
    };
  },
  props: {
    event: {
      type: Object,
      default: () => {
        return {};
      }
    },
    display: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("Admin", ["teamInformation","eventsInformation"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters('Admin',['getEventAssginedTo']),

    computeDisplay: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit("toggle", val);
      }
    },

  },
 
  components: {
    Title,
    MoreInformation,
    Dropdown
  }
};
</script>
<style lang="scss" scoped>
.view_event_dialog_item {
  margin: 1em;
  border: 1.2px solid whitesmoke;
  padding: 1em;
  border-radius: 5px;
  max-width: 100%;
  &.no_border {
    border: none;
  }
}
h4 {
  margin-bottom: 10px;
}
.view_event_col {
  margin: 1em;
}
</style>
