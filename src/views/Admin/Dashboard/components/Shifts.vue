<template>
  <el-col>
    <el-row class="h-100">
      <Title
        title="Events"
        subtitle="View all categorised events below. Feel free to make updates as you see fit."
      />
      <el-card class="mt-3 rounded" v-if="!returnAnyShifts" shadow="none">
        <Title
          :title="noShiftsContent.title"
          :subtitle="noShiftsContent.subtitle"
          class="txt_center"
        >
          <el-button
            type="info"
            size="small"
            plain
            @click="$router.push({ name: 'schedule' })"
          >{{ noShiftsContent.buttonText }}</el-button>
        </Title>
      </el-card>

      <!-- SHIFTS IN CATEGORIES -->
      <transition-group name="el-fade-in" tag="div">
        <el-col v-for="(category, index) in categorisedShifts" :key="index">
          <Shift v-for="(shift, key) in category" :key="key" :shift="shift" />
        </el-col>
      </transition-group>
    </el-row>
  </el-col>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import dates from "@/mixins/dates";
import Popover from "@/components/Popover.vue";
import Dropdown from "@/components/Dropdown.vue";
import Avatar from "@/components/Avatar.vue";
import employeeMethods from "@/mixins/employeeMethods";
import Shift from "./Shift";
import Notification from "@/components/Notification";
import Title from "@/components/Title";
import Nocontent from "@/components/Nocontent";
export default {
  name: "Shifts",
  data() {
    return {
      displayPreviousShifts: false
    };
  },
  destroyed() {
    clearInterval(this.interval);
  },
  created() {
    this.getShifts();
    this.getTeam();
    this.getNotifications();
  },
  mixins: [dates, employeeMethods],
  computed: {
    ...mapState(["userInformation", "userNotifications"]),
    ...mapState("Admin", ["shifts", "team", "shiftTypes", "groupIDs"]),
    ...mapGetters(["getIsAdmin"]),
    categorisedShifts() {
      let { today, upcoming, previous } = this.shifts;
      return {
        today,
        upcoming,
        previous
      };
    },
    noShiftsContent() {
      let noShifts = {
        title: "No current events.",
        subtitle: "You can view or create new requests here",
        buttonText: "Make a request for some time off or holiday time."
      };

      if (this.getIsAdmin) {
        noShifts.subtitle = "You can view or create new shifts here";
        noShifts.buttonText = "Book an employee's / holiday or time off";
      }
      return noShifts;
    },
    returnAnyShifts() {
      return Object.values(this.shifts).length > 0;
    }
  },
  methods: {
    ...mapActions("Admin", ["getShifts", "getTeam"]),
    ...mapActions(["getNotifications"]),
    ...mapMutations(["UPDATE_VIEW_NOTIFICATIONS_CENTER"])
  },
  components: {
    Popover,
    Dropdown,
    Avatar,
    Title,
    Shift
  }
};
</script>

<style lang="scss" scoped>
.messenger_container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3em;
}
.notifications_text_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.shift_overflow {
  max-height: 90%;
  overflow: auto;
}
.no_shifts_container {
  display: flex;
  align-items: center;
  justify-content: center;
  h4 {
    font-weight: 300;
  }
}
</style>
