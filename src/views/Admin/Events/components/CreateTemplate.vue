<template>
  <!-- Slide download -->
  <el-card class="create_template_container p-2 mt-4" v-loading="loading">
    <Title
      title="Create Template"
      class="m-0 p-0"
      subtitle="Fill in the following form to create a new template.</br>
     <i class='bx bx-error'></i> Warning templates when added to the events will last for <strong>one week</strong>.
      "
    />

    <!-- Predefined configs -->
    <el-checkbox-group v-model="configDisplay" size="mini" class="m-3">
      <el-checkbox-button
        v-for="({ text, model, disable }, index) in switches"
        :label="model"
        :disabled="disable ? disable : false"
        :key="index"
        >{{ text }}</el-checkbox-button
      >
    </el-checkbox-group>

    <!-- Form -->
    <Form
      :config="templateForm"
      submitText="Submit Template"
      @val="createTemplate"
      size="small"
    />
  </el-card>
</template>

<script>
import Title from "@/components/Title";
import Form from "@/components/Form";
import { mapGetters, mapState, mapActions } from "vuex";
import moment from "moment";
export default {
  name: "CreateTemplate",
  data() {
    return {
      configDisplay: ["disableRepeatFor", "individualUserGroups"],
      loading: false
    };
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", [
      "getTeamMember",
      "getDropdownTeamMembers",
      "teamInformation",
      "getUsersInUserGroup"
    ]),
    ...mapState(["clientInformation", "daysOfWeek"]),

    switches() {
      return [
        {
          text: "Generate for working week (Mon-Fri)",
          model: "disableRepeatFor"
        },
        {
          text: "Assign to individual users",
          model: "individualUsers"
        },
        {
          text: "Assign to user groups",
          model: "individualUserGroups"
        },
        {
          text: "Assign to all users",
          model: "allUsers",
          disable:
            this.contains("individualUserGroups") ||
            this.contains("individualUsers")
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
          model: "name",
          "component-type": "text",
          placeholder: "Template name",
          optional: true,
          hint: `Optional: Default name will be <strong>template_${new Date().toISOString()}</strong>`
        },
        {
          model: "type",
          "component-type": "select",
          placeholder: "Select event type",
          options: this.clientInformation.eventGroups,
          optional: true,
          mutiple: true
        },
        {
          model: "weekdays",
          "component-type": "select",
          options: this.daysOfWeek,
          placeholder: "Select repeat for",
          multiple: true,
          disabled: this.contains("disableRepeatFor"),
          optional: this.configDisplay["disableRepeatFor"]
        },
        {
          model: "timeRange",
          "component-type": "time-picker",
          start_placeholder: "Start Time",
          end_placeholder: "End time",
          isRange: true
        }
      ];

      if (this.getIsAdmin && this.contains("individualUsers")) {
        templateConfig.unshift({
          placeholder: "Select team members",
          id: "assignedTo",
          "component-type": "select",
          model: "assignedTo",
          clearable: true,
          options: this.getDropdownTeamMembers,
          multiple: true
        });
      }
      if (this.getIsAdmin && this.contains("individualUserGroups")) {
        templateConfig.unshift({
          model: "userGroup",
          "component-type": "select",
          placeholder: "Select user group",
          options: this.clientInformation.userGroups,
          optional: true,
          mutiple: true
        });
      }
      if (this.contains("disableRepeatFor")) {
        templateConfig.splice(3, 1);
      }

      return templateConfig;
    }
  },
  methods: {
    ...mapActions(["request"]),
    contains(item) {
      return this.configDisplay.some(x => x == item);
    },
    createTemplate(form) {
      let nextWeek = moment()
        .add(1, "week")
        .endOf("week")
        .toISOString();

      let templateForm = {
        name: form.name,
        content: {
          type: form.type,
          assignedTo: [],
          repeat: { weekdays: [], until: nextWeek },
          startDate: form.timeRange[0].toISOString(),
          endDate: form.timeRange[1].toISOString()
        }
      };

      if (this.contains("disableRepeatFor")) {
        templateForm.content.repeat.weekdays = [1, 2, 3, 4, 5];
      }

      if (this.contains("individualUserGroups")) {
        let selectedUserGroup = form.userGroup;
        templateForm.content.assignedTo = this.getUsersInUserGroup(
          selectedUserGroup
        );
      }

      this.loading = true;
      this.request({
        method: "POST",
        url: "events/templates/create",
        data: { ...templateForm }
      })
        .then(response => {
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
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
