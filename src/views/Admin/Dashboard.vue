<template>
  <div style="height:100%">
    <el-row type="flex" style="height:100%">
      <el-col class="p-3" style="height:100%">
        <Title title="Dashboard" subtitle="View your daily summaries here" />
        <el-checkbox
          class="ml-3"
          v-if="previousShifts.length > 0"
          v-model="displayPreviousShifts"
          label="View Previous Shifts"
          border
          size="small"
        ></el-checkbox>

        <el-row style="height:80%; overflow:auto">
          <el-col v-for="(prop, key) in categoriedShifts" :key="key">
            <el-divider class="member_name">{{ key }}</el-divider>
            <Shift v-for="(shift, key) in categoriedShifts[key]" :key="key" :shift="shift" />
          </el-col>

          <!-- PREVIOUS SHIFTS -->
          <el-collapse-transition>
            <el-col
              class="shift_overflow"
              v-if="previousShifts.length > 0 && displayPreviousShifts"
            >
              <el-divider>Previous</el-divider>
              <Shift v-for="(shift, key) in previousShifts" :key="key" :shift="shift" />
            </el-col>
          </el-collapse-transition>
        </el-row>
      </el-col>
      <!-- NOTIFICATIONS -->
      <el-col class="p-3">
        <Title
          title="Notifications"
          subtitle="View your notifications a summary of your notifications here."
        />
        <div v-if="userNotifications.length > 0" class="notifications_text_container">
          <p>
            You have {{ userNotifications.length }}
            {{
            userNotifications.length > 1 ? 'notifications' : 'notification'
            }}
            press the button to view them.
          </p>
          <el-button
            class="mt-3"
            size="small"
            @click="UPDATE_VIEW_NOTIFICATIONS_CENTER(true)"
          >View Notifications</el-button>
        </div>
        <div v-else class="notifications_text_container">
          <p style="text-align:center">No notifications detected. Guess it's a quiet day.</p>
        </div>
      </el-col>

      <!-- TEAM SIDEBAR -->
      <Team />
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import dates from "@/mixins/dates";
import Popover from "@/components/Popover.vue";
import Dropdown from "@/components/Dropdown.vue";
import Avatar from "../../components/Avatar.vue";
import Team from "./components/Team";
import employeeMethods from "@/mixins/employeeMethods";
import Shift from "./components/Shift";
import Notification from "@/components/Notification";
export default {
  name: "Dashboard",
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
        future: [],
        previous: []
      };
      let len = shifts.length;
      let format = "DD MMM YYYY HH:mm ";

      // Object details
      let weeks = _shifts.week;
      let today = _shifts.today;
      let future = _shifts.future;
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
          if (!this.isFuture(newShift.isoEnd)) {
            newShift.completed = true;
          }

          // Sort shifts into date categories
          if (this.isToday(newShift.isoStart)) {
            today.push(newShift);
          } else if (this.isThisWeek(newShift.isoStart)) {
            weeks.push(newShift);
          } else if (this.isFuture(newShift.isoStart, true)) {
            future.push(newShift);
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
    Title: () => import("@/components/Title"),
    Team,
    Shift,
    Notification
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
</style>
