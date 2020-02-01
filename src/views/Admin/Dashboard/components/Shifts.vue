<template>
  <el-col class="p-3">
    <!-- PREVIOUS SHIFTS SELECTION -->
    <el-checkbox-button
      size="mini"
      :disabled="previousShifts.length <= 0"
      v-model="displayPreviousShifts"
      :label="
          previousShifts.length <= 0
            ? 'No shifts / events to display'
            : 'View previous events / shifts'
        "
      border
    ></el-checkbox-button>

    <!-- No shifts  -->
    <el-row class="h-100 overflow">
      <el-card class="mt-3 rounded" v-if="!returnAnyShifts" shadow="none">
        <Title
          :title="noShiftsContent.title"
          :subtitle="noShiftsContent.subtitle"
          style="font-size:.8em; text-align:center"
        >
          <el-button
            type="primary"
            plain
            size="small"
            @click="$router.push({ name: 'schedule' })"
          >{{ noShiftsContent.buttonText }}</el-button>
        </Title>
      </el-card>

      <!-- SHIFTS IN CATEGORIES -->
      <transition name="el-fade-in">
        <el-col
          v-for="(prop, key) in categoriedShifts"
          :key="key"
          class="flex align-center columns w-100"
        >
          <el-divider class="member_name">{{ key }}</el-divider>
          <Shift v-for="(shift, key) in categoriedShifts[key]" :key="key" :shift="shift" />
        </el-col>
      </transition>

      <!-- PREVIOUS SHIFTS -->
      <el-collapse-transition>
        <el-col class="shift_overflow" v-if="previousShifts.length > 0 && displayPreviousShifts">
          <el-divider>Previous</el-divider>
          <Shift v-for="(shift, key) in previousShifts" :key="key" :shift="shift" />
        </el-col>
      </el-collapse-transition>
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
    ...mapState(["currentUser", "userNotifications"]),
    ...mapState("Admin", ["shifts", "team"]),
    ...mapGetters(["getIsAdmin"]),

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
      let result = Object.keys(this.categoriedShifts).length > 0;
      return result;
    },
    previousShifts() {
      return this.returnShifts.previous;
    },
    categoriedShifts() {
      return this.returnShifts.categories;
    },
    returnShifts() {
      let shifts = this.shifts;
      let _shifts = {
        week: [],
        today: [],
        upcoming: [],
        previous: []
      };
      let len = shifts.length;
      let format = this.$mq == "lg" ? "DD MMM YYYY HH:mm " : "DD MMM HH:mm";

      // Object details
      let weeks = _shifts.week;
      let today = _shifts.today;
      let upcoming = _shifts.upcoming;
      let previous = _shifts.previous;

      for (let i = 0; i < len; i++) {
        const shift = shifts[i];
        if (this.getIsAdmin || shift.assigned_to == this.currentUser._id) {
          let newShift = Object.assign({}, shift);
          let teamMember =
            this.team.find(x => {
              return x._id == shift.assigned_to;
            }) || this.currentUser;

          // Shift conversion
          let shiftDetails = this.convertShift(shift.shift_type);
          newShift.user = teamMember.employee_type;
          newShift.assigned_to = teamMember.name;
          newShift.shift_type = shiftDetails.title;
          newShift.startDate = this.format(newShift.startDate, format);
          newShift.endDate = this.format(newShift.endDate, format);
          newShift.isoStart = shift.startDate;
          newShift.isoEnd = shift.endDate;
          newShift.shift_type_num = shift.shift_type;
          newShift.class = shiftDetails.class;
          newShift.completed = false;
          // Set whether shift is completd or not
          if (!this.isAfter(newShift.isoEnd, true)) {
            newShift.completed = true;
          }

          // Sort shifts into date categories
          if (this.isToday(newShift.isoStart)) {
            today.push(newShift);
          } else if (this.isThisWeek(newShift.isoStart)) {
            weeks.push(newShift);
          } else if (this.isAfter(newShift.isoStart, true)) {
            upcoming.push(newShift);
          } else {
            previous.push(newShift);
          }
        }
      }
      let categories = {};
      // Dynammically adding and removing from the object
      for (let property in _shifts) {
        let categoryArray = _shifts[property];
        if (categoryArray.length > 0 && property != "previous") {
          categories[property] = categoryArray;
        }
      }

      return {
        categories,
        previous: _shifts.previous
      };
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
