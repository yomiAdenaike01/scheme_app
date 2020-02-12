<template>
  <el-col class="filters_container">
    <h1>Filters</h1>
  </el-col>
</template>

<script>
import Title from "@/components/Title";
import Nocontent from "@/components/Nocontent";
import Tabs from "@/components/Tabs";
import shiftTypes from "@/mixins/shiftTypes";

import { mapGetters } from "vuex";
export default {
  name: "ScheduleFilters",
  mixins: [shiftTypes],

  data() {
    return {
      localFilters: {}
    };
  },

  props: {
    view: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters("Admin", ["getDropdownTeamMembers"]),
    tabs() {
      return [
        {
          label: "Schedule Filters",
          formContent: this.formConfig
        }
      ];
    },
    formConfig() {
      return [
        {
          model: "schedule_view",
          type: "select",
          placeholder: "Select a calendar view",
          options: [
            {
              text: "Week",
              value: "week"
            },
            {
              text: "Day",
              value: "day"
            },
            {
              text: "Month",
              value: "month"
            }
          ]
        },
        {
          model: "assignedTo",
          type: "select",
          placeholder: "View shifts assigned to",
          options: this.getDropdownTeamMembers
        },
        {
          model: "startDate",
          type: "date"
        },

        {
          model: "endDate",
          type: "date"
        },
        {
          model: "type",
          type: "select",
          options: this.returnShiftTypes(null, "value")
        }
      ];
    },
    viewController: {
      get() {
        return this.view;
      },
      set(val) {
        this.$emit("toggle", val);
      }
    }
  },
  methods: {
    closeApplyFilters(filters) {
      this.$set(this, "localFilters", filters);
      this.$emit("updateFilters", this.localFilters);
      this.viewController = false;
    }
  },
  components: {
    Title,
    Nocontent,
    Tabs
  }
};
</script>
<style lang="scss" scoped>
.filters_container {
  width: 20%;
  background: whitesmoke;
}
</style>
