<template>
  <div style="height:100%">
    <Title title="Schedule" subtitle="View your calendar" />
    <el-row v-loading="loading" type="flex">
      <el-col class="pl-3 pr-3">
        <el-row class="mb-4" type="flex" :gutter="10" align="middle">
          <el-col>
            <el-switch
              v-model="liveSchedule"
              active-text="Live Schedule"
            ></el-switch>
          </el-col>
          <el-col>
            <Dropdown
              :items="items"
              @method="displayModals"
              :icon="false"
              position="right"
            >
              <el-button round type="primary">
                Actions
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </Dropdown>
          </el-col>
        </el-row>
        <ScheduleCalendar
          @regetShifts="regetShifts"
          @displayCreateShift="modals.create_event = $event"
          style="height:70%"
        />
      </el-col>
    </el-row>

    <CreateShift
      @toggle="modals.create_event = $event"
      @createEvent="createEvent"
      :display="modals.create_event"
    />
    <CreateEmployee
      @toggle="modals.create_employee = $event"
      :display="modals.create_employee"
    />
    <ScheduleProfileView />
  </div>
</template>

<script>
import dates from '@/mixins/dates'
import { mapState, mapActions, mapGetters } from 'vuex'
import CreateShift from './components/dialogs/CreateShift'
import CreateEmployee from './components/dialogs/CreateEmployee'

import Dropdown from '@/components/Dropdown.vue'
import Popover from '@/components/Popover'
import ScheduleProfileView from './components/ScheduleProfileView.vue'
import ScheduleCalendar from './components/ScheduleCalendar'
export default {
  name: 'Schedule',
  data() {
    return {
      loading: false,
      liveSchedule: false,
      interval: () => {
        setInterval(() => {
          this.getTeam()
        }, 5000)
      },
      filters: {
        employee: '',
        abscences: '',
        holidays: '',
        late: ''
      },
      modals: {
        create_event: false,
        edit_event: false,
        view_profile: false,
        export_profile: false,
        export_schedule: false,
        create_employee: false
      },

      currentView: '',
      dateFormat: 'DD MMMM'
    }
  },
  destroyed() {
    clearInterval(this.interval)
  },
  created() {
    this.getTeam()
    this.getShifts()
    setInterval(() => {
      this.getShifts()
    }, 5000)
  },

  computed: {
    ...mapState('Admin', ['team']),
    ...mapGetters(['getIsAdmin']),

    items() {
      const isAdmin = this.getIsAdmin
      let items = [
        {
          name: isAdmin ? 'Create Event' : 'Create Request',
          command: 'create_event'
        },

        {
          name: isAdmin ? 'Update / Remove Event' : 'Update / Remove Request',
          command: 'edit_event'
        },
        {
          name: 'Create Employee',
          command: 'create_employee',
          divided: true
        },
        {
          name: 'Export Employee',
          command: 'export_employee'
        },
        {
          name: 'Export Schedule',
          command: 'export_schedule'
        }
      ]

      if (!isAdmin) {
        items.filter(item => {
          return (
            item.command == 'export_employee' ||
            item.command == 'create_employee'
          )
        })
      }
      return items
    },

    viewSelectionConfig() {
      return [
        { name: 'Month', value: 'month' },
        { name: 'Week', value: 'week' },
        { name: 'Day', value: 'day' }
      ]
    },
    filterConfig() {
      let filters = []
      for (let filter in this.filters) {
        filters.push(filter)
      }
      return filters
    },
    formConfig() {
      return [
        {
          label: 'Assign To and Date',
          items: { name: '', model: '', component: '' }
        }
      ]
    }
  },
  methods: {
    ...mapActions(['request']),
    ...mapActions('Admin', ['getTeam', 'getShifts']),
    regetShifts() {
      this.getShifts()
      console.log('getting new shifts')
    },
    createEmployee(employeeData) {},
    createEvent(eventData) {
      this.loading = true
      this.modals.createEvent = false
      const date = {
        start: new Date(eventData.date[0]).toISOString(),
        end: new Date(eventData.date[1]).toISOString()
      }

      const payload = {
        url: '/shifts/create',
        method: 'POST',
        data: {
          startDate: date.start,
          endDate: date.end,
          shift_type: eventData.eventType,
          assigned_to: eventData.assignTo
        }
      }

      this.request(payload)
        .then(response => {
          this.loading = false
          this.getShifts()
        })
        .catch(error => {
          this.loading = false
        })
    },
    displayModals(command) {
      console.log(command)
      this.modals[command] = true
    }
  },
  mixins: [dates],

  components: {
    Title: () => import('@/components/Title'),
    ScheduleCalendar,
    CreateShift,
    Dropdown,
    Popover,
    ScheduleProfileView,
    CreateEmployee
  }
}
</script>

<style lang="scss" scoped>
.view_indicator {
  text-transform: capitalize;
}
.sidebar {
  background: rgb(253, 253, 253);
  height: 100vh;
}
span {
  font-size: 1.2em;
}
.vuecal {
  box-shadow: none;
}
.checkbox {
  text-transform: capitalize;
}
.view_indicator {
  color: #2f74eb;
}
.time_wrapper {
  background: rgb(253, 253, 253);
  color: #999;
  border-radius: 40px;
  font-size: 0.9em;
}
.icon {
  cursor: pointer;
}
</style>
