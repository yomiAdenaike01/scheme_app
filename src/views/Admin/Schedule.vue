<template>
  <div>
    <h1 class="m-4">Schedule</h1>
    <el-row v-loading="loading" type="flex">
      <el-col class="p-3">
        <el-row class="m-4" type="flex" justify="space-between">
          <el-col>
            <Popover>
              <template #content>
                <el-input placeholder="Search" />
              </template>
              <template #trigger>
                <el-button icon="el-icon-search" circle />
              </template>
            </Popover>
            <Dropdown
              :items="items"
              @method="displayModals"
              :icon="false"
              position="right"
            >
              <el-button round
                >Actions <i class="el-icon-arrow-right "></i
              ></el-button>
            </Dropdown>
          </el-col>
        </el-row>
        <ScheduleTable :tableData="tableData" />
        <ScheduleStaff />
      </el-col>
    </el-row>

    <ScheduleFormDialog
      @toggle="modals.createEvent = $event"
      @createEvent="createEvent"
      :display="modals.createEvent"
    />
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import dates from '@/mixins/dates'
import { mapState, mapActions, mapGetters } from 'vuex'
import ScheduleFormDialog from './components/ScheduleFormDialog'
import ScheduleStaff from './components/ScheduleStaff'
import Dropdown from '@/components/Dropdown.vue'
import Popover from '@/components/Popover'

export default {
  name: 'Schedule',
  data() {
    return {
      loading: false,

      filters: {
        employee: '',
        abscences: '',
        holidays: '',
        late: ''
      },
      modals: {
        createEvent: false,
        editEvent: false
      },

      tableData: [
        {
          date: '2016-05-03',
          name: 'Simon',
          position: 'Locumn',
          approved: false
        },
        {
          date: '2016-05-02',
          name: 'Yomi',
          position: 'Floor Staff',

          approved: true
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          position: 'Locumn',
          approved: false
        },
        {
          date: '2016-05-01',
          name: 'Jumoke',
          position: 'Floor Staff',

          approved: true
        }
      ],

      currentView: '',
      dateFormat: 'DD MMMM'
    }
  },
  created() {
    this.getTeam()
  },

  computed: {
    ...mapState('Admin', ['team']),
    ...mapGetters(['getIsAdmin']),
    items() {
      const isAdmin = this.getIsAdmin
      let items = [
        {
          name: isAdmin ? 'Create Event' : 'Create Request',
          command: 'add_event'
        },
        {
          name: 'Create Employee',
          command: 'create_employee'
        },
        {
          name: isAdmin ? 'Update / Remove Event' : 'Update / Remove Request',
          command: 'edit_event'
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
    ...mapActions('Admin', ['getTeam']),
    createEvent(eventData) {
      this.loading = true
      this.modals.createEvent = false
      const date = { start: eventData.date[0], end: eventData.date[1] }
      const completeStartDate = this.toISO(date.start)
      const completeEndDate = this.toISO(date.end)

      const payload = {
        url: '/shifts/create',
        method: 'POST',
        data: {
          startDate: completeStartDate,
          endDate: completeEndDate,
          shift_type: eventData.eventType
        }
      }
      if (eventData.assignTo) {
        payload.assigned_to = eventData.assignTo
      }
      this.request(payload)
        .then(response => {
          const message = this.getIsAdmin
            ? 'Event successfully created'
            : 'Request successfully created'
          this.$notify({
            title: 'Success',
            message: message,
            type: 'success'
          })
          this.loading = false
        })
        .catch(error => {
          this.$notify.error({
            title: 'Error',
            message: 'Error when creating event, please try again later'
          })
          this.loading = false
        })
    },
    displayModals(command) {
      console.log(command)
      if (command == 'add_event') {
        this.modals.createEvent = true
      } else {
        this.modals.editEvent = true
      }
    }
  },
  mixins: [dates],

  components: {
    VueCal,
    Title: () => import('@/components/Title'),
    ScheduleTable: () => import('./components/ScheduleTable'),
    ScheduleFormDialog,
    ScheduleStaff,
    Dropdown,
    Popover
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
