<template>
  <!-- Slide download -->
  <div v-loading="loading" class="create_template_container ">
    <!-- Predefined configs -->
    <el-checkbox-group
      v-model="configDisplay"
      size="mini"
      class="switch_containers"
    >
      <el-checkbox-button
        v-for="({ text, model, disable }, index) in switches"
        :key="index"
        :label="model"
        :disabled="disable ? disable : false"
        >{{ text }}</el-checkbox-button
      >
    </el-checkbox-group>

    <!-- Form -->
    <Form
      :config="templateForm"
      submit-text="Submit Template"
      size="small"
      @val="createTemplate"
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";

import Form from "@/components/Form";

export default {
  name: "CreateTemplate",
  components: {
    Form
  },
  data() {
    return {
      configDisplay: ["disableRepeatFor", "individualUserGroups"],
      loading: false
    };
  },
  computed: {
    ...mapState(["clientInformation", "daysOfWeek"]),
    ...mapGetters([
      "getIsAdmin",
      "getUserGroups",
      "getDropdownTeamMembers",
      "getUsersInGroup"
    ]),

    switches() {
      return [
        {
          text: "Generate for working week",
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

    defaultName() {
      return `template ${new Date().toISOString()}`;
    },

    templateForm() {
      let templateConfig = [
        {
          model: "name",
          "component-type": "text",
          placeholder: "Template name",
          optional: true
        },
        {
          model: "type",
          "component-type": "select",
          placeholder: "Select event type",
          options: [...this.clientInformation.event_groups].map(group => {
            return { label: group.label, value: group.groupID };
          }),
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
          id: "assigned_to",
          "component-type": "select",
          model: "assigned_to",
          clearable: true,
          options: this.getDropdownTeamMembers,
          multiple: true
        });
      }
      if (this.getIsAdmin && this.contains("individualUserGroups")) {
        templateConfig.unshift({
          model: "user_group",
          "component-type": "select",
          placeholder: "Select user group",
          options: this.getUserGroups,
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
    ...mapMutations("Events", [
      "CREATE_EVENT_TEMPLATE",
      "UPDATE_EVENT_TEMPLATE"
    ]),
    contains(item) {
      return this.configDisplay.some(x => x == item);
    },
    createTemplate(
      form = {
        weekdays: [1, 2, 3, 4, 5],
        type: 1,
        name: this.defaultName,
        timeRange: [
          new Date().toISOString(),
          new Date(new Date().setDate(new Date().getDay() + 2))
        ]
      }
    ) {
      // this.loading = true;

      let nextWeek = this.initMoment()
        .add(1, "week")
        .endOf("week")
        .toISOString();

      let templateForm = {
        name: form.name,
        content: {
          type: form.type,
          assigned_to: [],
          repeat: { weekdays: form.weekdays, until: nextWeek },
          start_date: form.timeRange[0].toISOString(),
          end_date: form.timeRange[1].toISOString()
        }
      };

      if (this.contains("disableRepeatFor")) {
        templateForm.content.repeat.weekdays = this.clientInformation.timings
          ?.workingDays ?? [1, 2, 3, 4, 5];
      }

      if (this.contains("individualUserGroups")) {
        let selecteduser_group = form.user_group;
        templateForm.content.assigned_to = this.getUsersInGroup(
          selecteduser_group
        );
      }
      this.CREATE_EVENT_TEMPLATE(templateForm);
      this.request({
        method: "POST",
        url: "events/templates/create",
        data: templateForm
      })
        .then(response => {
          this.UPDATE_EVENT_TEMPLATE({ update: response });
        })
        .catch(() => {
          this.DELETE_EVENT_TEMPLATE();
        });
      this.createEventTemplate({ ...templateForm })
        .then(() => {
          this.loading = false;
          this.$emit("toggle", false);
        })
        .catch(() => {
          this.loading = false;
          this.$emit("toggle", false);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.create_template_container {
  border: $border;
  padding: 10px;
}
.create_template_switch {
  &/deep/ {
    .el-switch__label span {
      font-size: 0.8em;
    }
  }
}
.switch_containers {
  margin: 20px 0;
}
</style>
