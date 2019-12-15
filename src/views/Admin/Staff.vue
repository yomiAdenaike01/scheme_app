<template>
  <div class="container">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="15">
            <h1>
              Employees
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
    <el-container>
      <el-main>
        <el-table :data="team"></el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "Staff",

  data() {
    return {
      employeeDialog: false
    };
  },
  computed: {
    ...mapState(["team"]),
    ...mapGetters(["getIsAdmin"])
  }
};
</script>

<style>
</style>