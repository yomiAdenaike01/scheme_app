<template>
  <el-card :body-style="{ padding: '0px' }" class="shift_container">
    <el-row type="flex">
      <el-col class="shift_details_container unit p-3">
        <h5 class="member_name">{{ shift.shift_type }}</h5>
        <p class="member_name mt-1 mb-1">
          {{ shift.assigned_to }}
        </p>
        <span class="grey employee_type"
          ><i class="el-icon el-icon-user grey"></i> {{ getEmployeeType }}</span
        >
      </el-col>
      <el-col :class="['shift_times unit p-3', shift.class]">
        <div style="display:flex;justify-content:center; align-items:center">
          <span class="date">{{ shift.startDate }}</span>
          <div
            class="ml-3 mr-3"
            style="display:flex; justify-content:center; align-items:center; flex-direction:column"
          >
            <i
              style="font-size:1.3em"
              class="el-icon el-icon-right p-0 m-0"
            ></i>
            <span>{{ diff }} {{ diffType }}</span>
          </div>
          <span class="date">{{ shift.endDate }}</span>
        </div>
      </el-col>
      <el-col class="p-3" v-if="shift.shift_type_num > 2">
        <div class="mt-3"></div>
        <el-steps :active="approvedStep" finish-status="success" align-center>
          <el-step :title="`${stepTypeText} created / requested`"></el-step>
          <el-step :title="`${stepTypeText} delibarated`"></el-step>
          <el-step :title="`${stepTypeText} ${approved}`"></el-step>
        </el-steps>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
import employeeMethods from '@/mixins/employeeMethods'
import dates from '@/mixins/dates'

export default {
  name: 'Shift',
  mixins: [employeeMethods, dates],

  data() {
    return {
      viewDetails: false,
      diffType: 'hours'
    }
  },
  props: {
    shift: Object
  },
  computed: {
    ...mapState(['currentUser']),
    approvedStep() {
      // let steps = 3;
      if (this.approved == 'accepted') return 4
      return 2
    },
    approved() {
      let result
      let approval = this.shift.is_approved
      if (approval.admin == 0) {
        result = 'declined'
      } else if (approval.admin == 0 && approval.user == 0) {
        result = 'undecided'
      } else if (approval.admin == 1 && approval.user == 1) {
        result = 'accepted'
      }
      return result
    },
    stepTypeText() {
      let step
      switch (this.shift.shift_type_num) {
        case 1:
          step = 'Shift'
          break
        case 2:
          step = 'Shift'
          break
        case 3:
          step = 'Holiday'
          break
        case 4:
          step = 'Time Off'
          break
        case 5:
          step = 'Sick Leave'
          break
        default:
          break
      }
      return step
    },
    diff() {
      let shift = this.shift
      let isoEnd = shift.isoEnd
      let isoStart = shift.isoStart
      let type = shift.shift_type_num
      let diff = this.duration(isoEnd, isoStart).as('hours')
      if (diff > 23) {
        this.diffType = 'days'
      } else if (diff > 100) {
        this.diffType = 'weeks'
      }
      diff = this.duration(isoEnd, isoStart).as(this.diffType)

      return Math.floor(diff)
    },
    getEmployeeType() {
      return this.convertEmployeeType(this.shift.user)
    }
  }
}
</script>

<style lang="scss" scoped>
.shift_container {
  margin: 3em;
  cursor: pointer;
}
// .normal_staff {
//   background: #ecf5ff;
//   color: #2f74eb;
//   // border-top: 2px solid #2f74eb;
// }
// .locumn {
//   background: #f0f9eb;
//   color: #67c23a;
//   // border-top: 2px solid #67c23a;
// }
// .holiday {
//   background: #fef0f0;
//   color: #f56c6c;
//   // border-top: 2px solid #f56c6c;
// }
// .time_off {
//   background: #fdf6ec;
//   color: #f2c678;
//   // border-top: 2px solid #f2c678;
// }
.shift_times {
  display: flex;
  justify-content: center;
  align-items: center;
}
.arrow {
  font-size: 3em;
}
.unit {
  border-right: 1px solid #e6e6e6;
}
.shift_details_container {
  width: 20%;
}
.employee_type {
  font-size: 0.8em;
  text-transform: uppercase;
}
.date {
  white-space: pre-line;
}
</style>
