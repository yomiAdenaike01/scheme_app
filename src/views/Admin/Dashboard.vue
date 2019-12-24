<template>
  <div style="height:100%">
    <el-row type="flex" style="height:100%">
      <el-col>
        <Title title="Dashboard" subtitle="View your daily summaries here" />
        <Shift v-for="(shift, key) in returnShifts" :key="key" :shift="shift" />
      </el-col>

      <!-- lAST SIDEBAR -->
      <Team />
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import dates from '@/mixins/dates'
import Popover from '@/components/Popover.vue'
import Dropdown from '@/components/Dropdown.vue'
import Avatar from '../../components/Avatar.vue'
import Team from './components/Team'
import employeeMethods from '@/mixins/employeeMethods'
import Shift from './components/Shift'
export default {
  name: 'Dashboard',
  data() {
    return {
      activeName: 'shifts'
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
    ...mapState(['currentUser']),
    ...mapState('Admin', ['shifts', 'team']),

    returnShifts() {
      let shifts = this.shifts
      let _shifts = []
      let len = shifts.length
      let format = 'DD MMM YYYY HH:mm '
      for (let i = 0; i < len; i++) {
        const shift = shifts[i]
        let newShift = Object.assign({}, shift)
        let teamMember =
          this.team.find(x => {
            return x._id == shift.assigned_to
          }) || this.currentUser
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
        _shifts.push(newShift)
      }

      return _shifts
    }
  },
  methods: {
    ...mapActions('Admin', ['getShifts', 'getTeam']),
    ...mapActions(['getNotifications'])
  },
  components: {
    Popover,
    Dropdown,
    Avatar,
    Title: () => import('@/components/Title'),
    Team,
    Shift
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
</style>
