<template>
  <div>
    <el-row type="flex" class="mt-4 mb-4">
      <el-col>
        <h1>
          Staff
          <strong class="grey">({{ getTeam.length }})</strong>
        </h1>
      </el-col>
      <el-col>
        <Popover>
          <template #content>
            <el-input placeholder="Search" />
          </template>
          <template #trigger>
            <el-button icon="el-icon-search" circle />
          </template>
        </Popover>
      </el-col>
      <el-col>
        <el-dropdown>
          <el-button round plain>
            Export
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>Export Employees</el-dropdown-item>
            <el-dropdown-item>Export Shifts</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="2" v-if="getIsAdmin">
        <el-button round type="primary" @click="employeeDialog = true"
          >Add Employee</el-button
        >
      </el-col>
    </el-row>

    <StaffAddEmployeeDialog
      :display="employeeDialog"
      @toggle="employeeDialog = $event"
    />
    <el-row type="flex" :gutter="9">
      <el-col v-for="member in getTeam" :key="member._id">
        <el-card :body-style="{ padding: '0px' }">
          <Avatar :name="member.name" />
          <div style="padding: 14px;">
            <span>{{ member.employee_type }}</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">View Profile</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import StaffAddEmployeeDialog from './StaffAddEmployeeDialog'
import Popover from '@/components/Popover'

export default {
  name: 'ScheduleStaff',

  data() {
    return {
      employeeDialog: false
    }
  },
  computed: {
    ...mapGetters(['getTeam']),

    ...mapGetters(['getIsAdmin'])
  },
  components: {
    StaffAddEmployeeDialog,
    Popover,
    Avatar: () => import('@/components/Avatar')
  }
}
</script>

<style></style>
