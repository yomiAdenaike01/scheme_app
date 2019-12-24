<template>
  <div style="height:100%">
    <el-row type="flex" style="height:100%">
      <el-col class="p-3">
        <Title title="Dashboard" subtitle="View your daily summaries here" />
        <el-switch
          class="ml-3"
          v-if="returnShifts.previous.length > 0"
          v-model="displayPreviousShifts"
          active-text="View Previous Shifts"
        ></el-switch>
        <el-row>
          <el-col v-if="returnShifts.week.length > 0">
            <el-divider>This Weeks Shifts</el-divider>

            <Shift
              v-for="(shift, key) in returnShifts.week"
              :key="key"
              :shift="shift"
            />
          </el-col>
          <el-col v-else>
            <p>No shifts today</p>
          </el-col>
          <el-col v-if="returnShifts.upcoming.length > 0">
            <el-divider>Upcoming Shifts</el-divider>

            <Shift
              v-for="(shift, key) in returnShifts.upcoming"
              :key="key"
              :shift="shift"
            />
          </el-col>
          <el-col v-else>
            <p>No upcoming shifts</p>
          </el-col>
          <el-collapse-transition>
            <el-col
              v-if="returnShifts.previous.length > 0 && displayPreviousShifts"
            >
              <el-divider>Previous Shifts</el-divider>
              <Shift
                v-for="(shift, key) in returnShifts.previous"
                :key="key"
                :shift="shift"
              />
            </el-col>
            <!-- <el-col v-else>
              <p>No previous shifts</p>
            </el-col> -->
          </el-collapse-transition>
        </el-row>
      </el-col>
      <!-- NOTIFICATIONS -->
      <el-col class="p-3">
        <Title
          title="Notifications"
          subtitle="View your notifications a summary of your notifications here."
        />
        <div v-if="userNotifications.length > 0">
          <Notification
            :notification="notification"
            v-for="notification in userNotifications"
            :key="notification._id"
          />
        </div>
        <div v-else class="no_notitfications_container">
          <p style="text-align:center">
            No notifications detected. Guess it's a quiet day.
          </p>
          <img
            src="@/assets/svg/chore_list.svg?data"
            width="200"
            height="200"
          />
        </div>
      </el-col>

      <!-- TEAM SIDEBAR -->
      <Team />
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import dates from '@/mixins/dates'
import Popover from '@/components/Popover.vue'
import Dropdown from '@/components/Dropdown.vue'
import Avatar from '../../components/Avatar.vue'
import Team from './components/Team'
import employeeMethods from '@/mixins/employeeMethods'
import Shift from './components/Shift'
import Notification from '@/components/Notification'
export default {
  name: 'Dashboard',
  data() {
    return {
      displayPreviousShifts: false
    }
  },
  destroyed() {
    clearInterval(this.interval)
  },
  created() {
    this.getShifts()
    this.getTeam()
    this.getNotifications()
  },
  mixins: [dates, employeeMethods],
  computed: {
    ...mapState(['currentUser', 'userNotifications']),
    ...mapState('Admin', ['shifts', 'team']),

    returnShifts() {
      let shifts = this.shifts
      let _shifts = {
        week: [],
        today: [],
        upcoming: [],
        previous: []
      }
      let len = shifts.length
      let format = 'DD MMM YYYY HH:mm '

      // Object details
      let weeks = _shifts.week
      let today = _shifts.today
      let upcoming = _shifts.upcoming
      let previous = _shifts.previous

      for (let i = 0; i < len; i++) {
        const shift = shifts[i]
        if (shift.assigned_to == this.currentUser._id) {
          let newShift = Object.assign({}, shift)
          let teamMember =
            this.team.find(x => {
              return x._id == shift.assigned_to
            }) || this.currentUser

          // Shift conversion
          let shiftDetails = this.convertShift(shift.shift_type)
          newShift.user = teamMember.employee_type
          newShift.assigned_to = teamMember.name
          newShift.shift_type = shiftDetails.title
          newShift.startDate = this.format(newShift.startDate, format)
          newShift.endDate = this.format(newShift.endDate, format)
          newShift.isoStart = shift.startDate
          newShift.isoEnd = shift.endDate
          newShift.shift_type_num = shift.shift_type
          newShift.class = shiftDetails.class
          newShift.completed = false
          // Set whether shift is completd or not
          if (!this.isFuture(newShift.isoEnd)) {
            newShift.completed = true
          }

          // Sort shifts into date categories
          if (this.isToday(newShift.isoStart)) {
            today.push(newShift)
          } else if (this.isThisWeek(newShift.isoStart)) {
            weeks.push(newShift)
          } else if (this.isFuture(newShift.isoStart, true)) {
            upcoming.push(newShift)
          } else {
            previous.push(newShift)
          }
        }
      }

      return _shifts
    }
  },
  methods: {
    ...mapActions('Admin', ['getShifts', 'getTeam']),
    ...mapActions(['getNotifications']),
    ...mapMutations(['UPDATE_VIEW_NOTIFICATIONS_CENTER'])
  },
  components: {
    Popover,
    Dropdown,
    Avatar,
    Title: () => import('@/components/Title'),
    Team,
    Shift,
    Notification
  }
}
</script>

<style lang="scss" scoped>
.messenger_container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3em;
}
.no_notitfications_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.el-col {
  // padding: 1rem;
}
</style>
