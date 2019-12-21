<template>
  <div>
    <el-container type="vertical">
      <el-main>
        <el-row>
          <el-col :span="15">
            <h1>
              Staff
              <strong class="grey">({{team.length}})</strong>
            </h1>
          </el-col>
          <el-col :span="2">
            <el-button icon="el-icon-search" circle />
          </el-col>
          <el-col :span="2">
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
            <el-button round type="primary" @click="employeeDialog = true">Add Employee</el-button>
          </el-col>
        </el-row>
      </el-main>

      <el-dialog :visible.sync="employeeDialog" title="Add Employee">
        <el-form>
          <el-form-item>
            <p>hello</p>
          </el-form-item>
          <el-form-item>
            <p>hello</p>
          </el-form-item>
          <el-form-item>
            <p>hello</p>
          </el-form-item>
          <el-form-item>
            <p>hello</p>
          </el-form-item>
          <el-form-item>
            <p>hello</p>
          </el-form-item>
          <el-form-item>
            <p>hello</p>
          </el-form-item>
          <el-form-item>
            <p>hello</p>
          </el-form-item>
          <el-form-item>
            <p>hello</p>
          </el-form-item>
          <el-form-item>
            <p>hello</p>
          </el-form-item>
          <el-form-item>
            <p>hello</p>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
    <el-row type="flex" :gutter="9" class="p-4">
      <el-col v-for="member in returnTeam" :key="member._id">
        <el-card :body-style="{ padding: '0px' }">
          <el-avatar>{{member.name}}</el-avatar>
          <div style="padding: 14px;">
            <span>{{member.employee_type}}</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">View Profile</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <Schedule /> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
// import Schedule from "./Schedule";
export default {
  name: "Staff",

  data() {
    return {
      employeeDialog: false
    };
  },
  computed: {
    ...mapState(["team"]),
    returnTeam() {
      let newTeam = [...this.team];
      const len = this.team.length;
      for (let i = 0; i < len; i++) {
        const member = newTeam[i];
        switch (member.employee_type) {
          case 1: {
            member.employee_type = "Admin";
            break;
          }
          case 2: {
            member.employee_type = "Staff";
            break;
          }
          case 3: {
            member.employee_type = "Locumn";
            break;
          }
        }
      }
      return newTeam;
    },
    ...mapGetters(["getIsAdmin"])
  },
  components: {
    // Schedule
  }
};
</script>

<style>
</style>