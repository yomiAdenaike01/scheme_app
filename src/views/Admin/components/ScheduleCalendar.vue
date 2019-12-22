<template>
  <!-- TODO: EMIT THE TIME AND PLACE IT WITHIN THE CREATE SHIFT -->
  <div>
    <vue-cal
      small
      v-loading="loading"
      :events="getShifts"
      default-view="week"
      hide-view-selector
      :on-event-click="viewShift"
      editable-events
      @event-duration-change="changeShiftTime"
    />
    <ViewShift
      :display="view"
      :shift="shift"
      @toggle="view = $event"
      @loading="loading = $event"
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import ViewShift from './dialogs/ViewShift'
export default {
  name: 'ScheduleCalendar',
  data() {
    return {
      view: false,
      loading: false,
      shift: {}
    }
  },
  computed: {
    ...mapGetters('Admin', ['getShifts']),
    ...mapState('Admin', ['shifts']),
    ...mapState(['currentUser']),
    // isMine() {
    //   return this.returnShiftDetails._id == this.currentUser._id
    // },

    returnShiftDetails() {
      return this.shifts.find(shift => {
        return shift.id == this.shift_id
      })
    }
  },
  methods: {
    ...mapActions(['request']),
    ...mapMutations(['UPDATE_NOTIFICATIONS']),

    viewShift(shift) {
      this.shift = shift
      this.view = true
    },
    displayCreateNewShift(startTime) {
      // TODO: EMIT THE TIME AND PLACE IT WITHIN THE CREATE SHIFT
      this.$emit('displayCreateShift', true)
    },
    changeShiftTime(shift) {
      this.$confirm(
        `Are you sure you would like to change ${
          shift.assigned_to
        }'s ${shift.type.toLowerCase()} from ${shift.start} to ${shift.end}`,
        'Confirm',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'info'
        }
      ).then(response => {
        this.loading = true
        const payload = {
          shift_id: shift.id,
          shift_update: {
            startDate: shift.startDate.toISOString(),
            endDate: shift.endDate.toISOString()
          }
        }

        this.request({
          url: '/shifts/update',
          method: 'POST',
          data: payload
        })
          .then(response => {
            this.loading = false
            let index = this.shifts.findIndex(shift => {
              return shift._id == response._id
            })
            console.log(index)
            // Replace the shift that is in the same spot with updates
            console.log(response)
          })
          .catch(error => {
            this.loading = false
            console.log(error)
          })
      })
      console.log(shift)
    }
  },
  components: {
    VueCal,
    ViewShift
  }
}
</script>

<style lang="scss">
.vuecal__now-line {
  color: #2f74eb;
}

.vuecal__event {
  &.normal_staff {
    background: #ecf5ff;
    color: #2f74eb;
    border-top: 2px solid #2f74eb;
  }
  &.locumn {
    background: #f0f9eb;
    color: #67c23a;
    border-top: 2px solid #67c23a;
  }
  &.holiday {
    background: #fef0f0;
    color: #f56c6c;
    border-top: 2px solid #f56c6c;
  }
  &.time_off {
    background: #fdf6ec;
    color: #f2c678;
    border-top: 2px solid #f2c678;
  }
  padding: 1em;
  text-transform: capitalize;
}
.el-icon-circle-close {
  color: red;
}
.el-icon-circle-check {
  color: green;
}
.vuecal__title-bar {
  font-size: 1.1em;
  background: none;
  font-weight: bold;
  .vuecal__title {
    button {
      color: #999;
    }
  }
}
</style>
