<template>
  <!-- TODO: EMIT THE TIME AND PLACE IT WITHIN THE CREATE SHIFT -->
  <div>
    <vue-cal
      small
      v-loading="loading"
      :events="getShifts"
      default-view="day"
      hide-view-selector
      :on-event-click="viewShift"
      editable-events
      @cell-dblclick="displayCreateNewShift"
      @event-duration-change="changeShiftTime"
    />
    <el-dialog :visible.sync="view">
      <Title
        slot="title"
        title="Details"
        subtitle="View and edit the details of the shift/event/request here."
        defaultClass="m-0"
      />

      <el-form>
        <el-form-item label="Assignee:">
          <p class="member_name">{{ shift.assigned_to }}</p>
        </el-form-item>
        <el-form-item label="Approved:">
          <p class="member_name">
            <i class="el-icon" :class="returnIcon" style="font-size:1.4em"></i>
            <el-button class="ml-3" v-if="!getIsAdmin"
              >Resend Request</el-button
            >
          </p>
        </el-form-item>
        <el-form-item label="Shift Type:">
          {{ shift.type }}
        </el-form-item>
        <el-divider><span class="grey">Timing</span></el-divider>
        <el-form-item label="Start Date Time:">
          <span>{{ shift.start }}</span>
        </el-form-item>
        <el-form-item label="End Date Time:">
          <span>{{ shift.end }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import Title from '@/components/Title'
export default {
  name: 'ScheduleTable',
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
    ...mapGetters(['getIsAdmin']),
    ...mapState(['currentUser']),
    // isMine() {
    //   return this.returnShiftDetails._id == this.currentUser._id
    // },
    returnIcon() {
      let approved = this.returnApproval
      let returnval
      if (approved) {
        returnval = 'el-icon-circle-check'
      } else {
        returnval = 'el-icon-circle-close'
      }
      return returnval
    },
    returnApproval() {
      if (this.returnShiftDetails) {
        let approval = this.returnShiftDetails.is_approved
        let returnval = false
        if (approval.admin == 1) {
          returnval = true
        }
        return returnval
      }
    },
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
        `Are you sure you would like to change ${shift.assigned_to}'s shift from ${shift.start} to ${shift.end}`,
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
    Title
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
  }
  &.locumn {
    background: #f0f9eb;
    color: #67c23a;
  }
  &.holiday {
    background: #fef0f0;
    color: #f56c6c;
  }
  &.sick_leave {
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
</style>
