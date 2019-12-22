<template>
  <div>
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
              <el-button
                type="text"
                class="button"
                @click="UPDATE_VIEW_USER(member._id)"
                >View Profile</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import StaffAddEmployeeDialog from './StaffAddEmployeeDialog'

export default {
  name: 'ScheduleStaff',

  data() {
    return {
      employeeDialog: false
    }
  },
  computed: {
    ...mapGetters('Admin', ['getTeam']),

    ...mapGetters(['getIsAdmin'])
  },
  methods: {
    ...mapMutations('Admin', ['UPDATE_VIEW_USER'])
  },
  components: {
    StaffAddEmployeeDialog,
    Avatar: () => import('@/components/Avatar')
  }
}
</script>

<style></style>
