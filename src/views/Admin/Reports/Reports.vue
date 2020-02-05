<template>
  <div class="reports_container overflow h-100">
    <div class="form_container flex flex--end">
      <Form
        class="form"
        inline
        defaultClass="m-0"
        :config="formConfig"
        @val="rerunRequest"
        :preModel="filters"
        :disable="true"
        liveUpdate
      />
    </div>

    <Chart class="m-4" />
    <!-- <el-row type="flex" v-for="(panel, index) in reportPanels" :key="index">
      <el-col v-for="(element, i) in panel" :key="i + index">
      
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import Tabs from "@/components/Tabs";
import Form from "@/components/Form";
import moment from "moment";
import Title from "@/components/Title";
import Chart from "./components/Chart";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "Reports",
  activated() {
    let defaultUser = this.getIsAdmin ? [] : this.userInformation._id;
    this.$set(this.filters, "assignedTo", defaultUser);
    this.request({
      method: "GET",
      url: "reports/dashboard",
      params: this.filters
    }).then(response => {});
  },
  data() {
    return {
      filters: {
        assignedTo: "",
        startDate: moment().toISOString(),
        endDate: moment().toISOString()
      }
    };
  },
  computed: {
    ...mapState("Admin", ["team", "reportPanels"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    formConfig() {
      return [
        {
          model: "assignedTo",
          "component-type": "select",
          multiple: true,
          options: this.team.map(member => {
            return { value: member._id, text: member.name };
          }),
          placeholder: "Assigned To"
        },
        {
          model: "startDate",
          "component-type": "date-picker",
          "input-type": "date",
          placeholder: "Start Date"
        },
        {
          model: "endDate",
          "component-type": "date-picker",
          "input-type": "date",
          placeholder: "End Date"
        }
      ];
    }
  },
  methods: {
    ...mapActions(["request"]),
    rerunRequest() {
      this.request({
        method: "GET",
        url: "reports/dashboard",
        params: this.filters
      })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: {
    Form,
    Title,
    Chart
  }
};
</script>

<style lang="scss" scoped>
.reports_container {
  width: 100%;
  line-height: 2em;
  font-size: 1.3em;
}
.form_container {
  .form > .el-form-item__content {
    width: 100%;
  }
}
</style>
