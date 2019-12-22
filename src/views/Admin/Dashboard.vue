<template>
  <div style="height:100%">
    <el-row type="flex" style="height:100%">
      <el-col>
        <Title title="Dashboard" subtitle="View your daily summaries here" />
      </el-col>
      <el-col></el-col>
      <el-col style="flex:0.2;border-left:solid 1px #e6e6e6;">
        <el-row class="team_container">
          <el-col v-for="member in getTeam" :key="member._id">
            <Dropdown
              :items="items"
              @method="handleEvents"
              position="left"
              :icon="false"
            >
              <Avatar :name="member.name" />
            </Dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import dates from '@/mixins/dates'
import Popover from '@/components/Popover.vue'
import Dropdown from '@/components/Dropdown.vue'
import Avatar from '../../components/Avatar.vue'

export default {
  name: 'Dashboard',
  data() {
    return {
      activeName: 'shifts'
    }
  },
  mixins: [dates],
  computed: {
    ...mapState(['requests']),
    ...mapState('Admin', ['shifts']),
    ...mapGetters('Admin', ['getTeam']),
    items() {
      return [
        {
          name: 'Message',
          command: 'message'
        },
        {
          name: 'View Requests',
          command: 'requests',
          divided: true
        }
      ]
    },
    returnShifts() {
      const shifts = this.shifts
      const len = shifts.length
      let shiftsDates = {
        week: [],
        today: [],
        upcoming: []
      }
      for (let i = 0; i < len; i++) {
        const shift = shifts[i]
        const startDate = shift.startDate
        if (this.isThisWeek(startDate)) {
          shiftsDates.week.push(shift)
        } else if (this.isToday(startDate)) {
          shiftsDates.today.push(startDate)
        } else if (this.isFuture(startDate, true, null)) {
          shiftsDates.upcoming.push(shift)
        }
      }
      // for (let property in shiftsDates) {
      //   let arr = shiftsDates[property];
      //   if (arr.length <= 0) {
      //     delete shiftsDates[property];
      //   }
      // }
      return shiftsDates
    }
  },
  methods: {
    handleEvents(event) {
      switch (event) {
        case 'message': {
          this.$router.push({ name: 'messenger' })
          break
        }
        case 'view_requests': {
          break
        }

        default:
          break
      }
    }
  },
  components: {
    Popover,
    Dropdown,
    Avatar,
    Title: () => import('@/components/Title')
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
.team_container {
  .el-col {
    padding: 1em;
    border-bottom: solid 1px #e6e6e6;
    cursor: pointer;
    &:hover {
      background-color: darken($color: #ffff, $amount: 2);
    }
  }
}
</style>
