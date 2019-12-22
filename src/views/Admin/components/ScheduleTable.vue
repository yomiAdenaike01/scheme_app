<template>
  <div>
    <vue-cal
      :events="getShifts"
      default-view="day"
      hide-view-selector
      :on-event-click="viewShift"
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
import { mapGetters, mapState } from 'vuex'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import Title from '@/components/Title'
export default {
  name: 'ScheduleTable',
  data() {
    return {
      view: false,
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
    },
    loading() {
      return
    }
  },
  methods: {
    viewShift(shift) {
      this.shift = shift
      this.view = true
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
  background: #ecf5ff;
  color: #2f74eb;
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
