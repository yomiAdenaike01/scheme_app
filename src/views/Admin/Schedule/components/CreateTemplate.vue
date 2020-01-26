<template>
  <!-- Slide download -->
  <el-card class="create_template_container p-2 mt-4">
    <Title
      title="Create Template"
      class="m-0 p-0"
      subtitle="Fill in the following form to create a new template"
    />

    <!-- Predefined configs -->
    <el-switch
      class="create_template_switch mb-3"
      v-for="(elem,index) in switches"
      :inactive-text="elem['text']"
      :key="index"
      v-model="configDisplay[elem['model']]"
    ></el-switch>

    <!-- Form -->
    <Form
      :config="returnCreateTemplate"
      submitText="Submit Template"
      @val="computeForm"
      size="small"
    />
  </el-card>
</template>

<script>
import Title from "@/components/Title";
import Form from "@/components/Form";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "CreateTemplate",
  data() {
    return {
      configDisplay: {}
    };
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getTeamMember", "getDropdownTeamMembers", "team"]),
    switches() {
      return [
        {
          text: "Generate for working week",
          model: "start_end_week"
        }
      ];
    },
    filterAssignedTo() {
      let dropDownTeamMembers = [...this.getDropdownTeamMembers];
      let team = this.team;
      let len = team.length;
      let filteredArray = [];
      // Generate array that finds and adds all their details for filtering
    },
    returnCreateTemplate() {
      let createTemplateConfig = [
        {
          model: "name",
          type: "text",
          placeholder: "Template Name",
          hint: ""
        },

        {
          model: "start_date",
          type: "date-time",
          placeholder: "Start date-time",
          disabled: this.configDisplay["start_end_week"]
        },
        {
          model: "end_date",
          type: "date-time",
          placeholder: "End date-time",
          disabled: this.configDisplay["start_end_week"]
        }
      ];

      if (this.getIsAdmin) {
        createTemplateConfig.unshift({
          name: "Assign Employees",
          placeholder: "Select Team Members",
          id: "assigned_to",
          type: "select",
          model: "assigned_to",
          clearable: true,
          options: this.getDropdownTeamMembers,
          multiple: true
        });
      }

      return createTemplateConfig;
    }
  },
  methods: {
    computeForm(val) {
      console.log(val);
      let { assigned_to } = val;

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
          assigned_to,
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
