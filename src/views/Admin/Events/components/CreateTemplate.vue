<template>
  <!-- Slide download -->
  <el-card class="create_template_container p-2 mt-4">
    <Title
      title="Create Template"
      class="m-0 p-0"
      subtitle="Fill in the following form to create a new template"
    />

    <!-- Predefined configs -->

    <p v-for="({text,model},index) in switches" :key="index" class="config_switches">
      <el-switch
        class="create_template_switch mb-3"
        :active-text="text"
        v-model="configDisplay[model]"
      ></el-switch>
    </p>

    <!-- Form -->
    <Form :config="templateForm" submitText="Submit Template" @val="computeForm" size="small" />
  </el-card>
</template>

<script>
import Title from "@/components/Title";
import Form from "@/components/Form";
import { mapGetters, mapState } from "vuex";
import moment from "moment";
import uuid from "uuid";
export default {
  name: "CreateTemplate",
  data() {
    return {
      configDisplay: {
        userGroupAssignment: true,
        start_end_week: true
      }
    };
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", [
      "getTeamMember",
      "getDropdownTeamMembers",
      "teamInformation"
    ]),
    ...mapState(["clientInformation"]),
    switches() {
      return [
        {
          text: "Generate for working week (Mon-Fri)",
          model: "start_end_week"
        },
        {
          text: "Assign to individual users",
          model: "multiUser"
        },
        {
          text: "Assign to user groups",
          model: "userGroupAssignment"
        }
      ];
    },
    filterAssignedTo() {
      let dropDownTeamMembers = [...this.getDropdownTeamMembers];
      let team = this.teamInformation;
      let len = team.length;
      let filteredArray = [];
      // Generate array that finds and adds all their details for filtering
    },
    templateForm() {
      let templateConfig = [
        {
          model: "eventGroup",
          "component-type": "select",
          placeholder: "Select event type",
          options: this.clientInformation.eventGroups,
          optional: true,
          mutiple: true
        },
        {
          model: "name",
          "component-type": "text",
          placeholder: "Template name",
          optional: true,
          hint: `Optional: Default name will be <strong>template_${uuid()}</strong>`
        },

        {
          model: "start_date",
          "component-type": "date-picker",
          "input-type": "date-time",
          placeholder: "Start date-time",
          disabled: this.configDisplay["start_end_week"],
          optional: this.configDisplay["start_end_week"]
        },
        {
          model: "end_date",
          "component-type": "date-picker",
          "input-type": "date-time",
          placeholder: "End date-time",
          disabled: this.configDisplay["start_end_week"],
          optional: this.configDisplay["start_end_week"]
        }
      ];

      if (this.getIsAdmin && !this.configDisplay.userGroupAssignment) {
        templateConfig.unshift({
          name: "Assign Employees",
          placeholder: "Select team members",
          id: "assignedTo",
          "component-type": "select",
          model: "assignedTo",
          clearable: true,
          options: this.getDropdownTeamMembers,
          multiple: true
        });
      }
      if (this.getIsAdmin && !this.configDisplay.multiUser) {
        templateConfig.unshift({
          model: "userGroup",
          "component-type": "select",
          placeholder: "Select user group",
          options: this.clientInformation.userGroups,
          optional: true,
          mutiple: true
        });
      }

      return templateConfig;
    }
  },
  methods: {
    computeForm(val) {
      console.log(val);
      let { assignedTo } = val;

      for (let i = 0; i < 5; i++) {
        // Generate shift for everyday of the week
        let startDate = moment().toDate();
        startDate.setDate(i - 1);
        startDate.setHours(9);
        startDate.setMinutes(0);
        startDate = startDate.toISOString();

        let endDate = moment().toDate();
        endDate.setDate(i - 1);
        endDate.setHours(17);
        endDate.setMinutes(0);
        endDate = endDate.toISOString();

        let shiftBuilder = {
          startDate,
          endDate,
          assignedTo,
          admin_gen: true
        };
        console.log(shiftBuilder);
      }
    }
  },
  components: {
    Form,
    Title
  }
};
</script>
<style lang="scss" scoped>
.create_template_switch {
  &/deep/ {
    .el-switch__label span {
      font-size: 0.8em;
    }
  }
}
</style>