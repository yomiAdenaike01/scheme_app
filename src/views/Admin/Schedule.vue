<template>
  <el-row>
    <el-col :span="3">
      <el-menu class="sidebar">
        <el-menu-item v-for="item in filterConfig" :key="item">
          <el-checkbox class="checkbox" v-model="filters[item]">{{ item }}</el-checkbox>
        </el-menu-item>
      </el-menu>
    </el-col>

    <el-col :span="20">
      <el-row class="m-4" type="flex" justify="space-between">
        <el-col :span="5" type="flex" align="center">
          <el-dropdown trigger="click">
            <span title="view_container">
              <span class="black bold">Schedule:</span>
              <span class="bold el-dropdown-link view_indicator">
                {{
                currentView
                }}
              </span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="view in viewSelectionConfig"
                :key="view.value"
                :command="view"
              >{{ view.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="4">
          <el-dropdown @command="displayModals">
            <el-button type="primary" round>Actions</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add_event">Create Request</el-dropdown-item>
              <el-dropdown-item command="edit_event">Update / Remove Request</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <!-- <vue-cal
        editable-events
        hide-view-selector
        ref="vuecal"
        default-view="week"
        :events="events"
      >
        <template v-slot:title="{ title, view }">
          <span v-if="view.id == 'week' || view.id == 'month'"
            >{{ format(view.startDate, dateFormat) }} -
            {{ format(view.endDate, dateFormat) }}</span
          >
          <span v-else>{{ format(view.startDate, dateFormat) }}</span>
        </template>
      </vue-cal>-->
      <el-table :data="tableData" border>
        <el-table-column>
          <template slot-scope="scope">
            <EmployeeTableUnit :data="scope.row" />
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!-- TODO: ADD REASON FOR TIME OFF ADD ATTACHMENT ,FOR SICK NOTES ,ADD VALIDATION -->
    <el-dialog
      v-loading="dialogLoading"
      custom-class="event_dialog"
      :title="getIsAdmin ? 'Create Event' : 'Create Request'"
      :visible.sync="modals.createEvent"
    >
      <el-form status-icon :rules="validationData" label-position="left" :model="eventData">
        <el-form-item label="Employee" v-if="getIsAdmin">
          <el-select
            v-model="eventData.assignTo"
            placeholder="Please select a team member you want to assign this to"
          >
            <el-option
              v-for="member in team"
              :key="member._id"
              :label="member.name"
              :value="member._id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Shift or Holiday">
          <el-select v-model="eventData.eventType" :placeholder="getIsAdmin ? '' : 'Holiday'">
            <el-option label="Shift" value="1" v-if="getIsAdmin" />
            <el-option label="Time-Off" value="4" />
            <el-option label="Holiday" value="3" />
            <el-option label="Sick Leave" value="5" />
          </el-select>
        </el-form-item>

        <el-form-item prop="date1" label="Start Date ">
          <el-date-picker type="date" placeholder="Pick a date" v-model="eventData.start.date"></el-date-picker>
        </el-form-item>
        <el-form-item prop="date2" label="Start Time">
          <el-time-picker placeholder="Pick a time" v-model="eventData.start.time"></el-time-picker>
        </el-form-item>
        <el-form-item prop="date1" label="End Date">
          <el-date-picker type="date" placeholder="Pick a date" v-model="eventData.end.date"></el-date-picker>
        </el-form-item>
        <el-form-item prop="date2" label="End Time">
          <el-time-picker placeholder="Pick a time" v-model="eventData.end.time"></el-time-picker>
        </el-form-item>
        <el-form-item
          label="Repeat Days"
          class="p-4"
          style="background:rgb(253,253,253); border-radius:10px"
        >
          <el-switch v-model="repeat_toggle" />
          <div v-if="repeat_toggle">
            <Title subtitle="Select the days of week that you wish to repeat this event for." />
            <el-checkbox-group v-model="eventData.repeat_days">
              <el-checkbox-button
                v-for="(btn,index) in repeatDaysConfig"
                :key="btn"
                :label="index"
              >{{btn}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </el-form-item>

        <el-form-item
          label="Save As Template"
          class="p-4"
          style="background:rgb(253,253,253); border-radius:10px"
        >
          <el-switch v-model="save_as_template" />
          <div v-if="save_as_template">
            <Title subtitle="Your templates will be stored so that you can use them later." />
            <el-input placeholder="E.g Yearly Time Off" v-model="eventData.template_name" />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" round @click="createEvent">Publish</el-button>
        <el-button round @click="modals.createEvent = false">Cancel</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import dates from "@/mixins/dates";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Schedule",
  data() {
    return {
      repeat_toggle: false,
      save_as_template: false,
      dialogLoading: true,

      filters: {
        shifts: "",
        abscences: "",
        assignments: "",
        preferences: ""
      },
      modals: {
        createEvent: false,
        editEvent: false
      },

      eventData: {
        start: {
          time: "",
          date: ""
        },
        assignTo: "",
        end: {
          time: "",
          date: ""
        },
        loading: false,
        eventType: "3",
        repeat_days: [0]
      },

      tableData: [
        {
          date: "2016-05-03",
          name: "Simon",
          position: "Locumn",
          approved: false
        },
        {
          date: "2016-05-02",
          name: "Yomi",
          position: "Floor Staff",

          approved: true
        },
        {
          date: "2016-05-04",
          name: "Tom",
          position: "Locumn",

          approved: false
        },
        {
          date: "2016-05-01",
          name: "Jumoke",
          position: "Floor Staff",

          approved: true
        }
      ],

      currentView: "",
      dateFormat: "DD MMMM",

      validationData: {
        startDate: [
          {
            type: "date",
            required: true,
            message: "Please pick a date",
            trigger: "change"
          }
        ],
        endDate: [
          {
            type: "date",
            required: true,
            message: "Please pick a date",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getTeam();
  },
  mounted() {
    // const vuecal = this.$refs.vuecal
    // this.currentView = vuecal.defaultView
    // this.startDate = vuecal.view.startDate
    // this.endDate = vuecal.view.endDate
  },
  computed: {
    ...mapState(["team"]),
    ...mapGetters(["getIsAdmin"]),
    repeatDaysConfig() {
      return ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
    },
    viewSelectionConfig() {
      return [
        { name: "Month", value: "month" },
        { name: "Week", value: "week" },
        { name: "Day", value: "day" }
      ];
    },
    filterConfig() {
      let filters = [];
      for (let filter in this.filters) {
        filters.push(filter);
      }
      return filters;
    },
    formConfig() {
      return [
        {
          label: "Assign To and Date",
          items: { name: "", model: "", component: "" }
        }
      ];
    }
  },
  methods: {
    ...mapActions(["getTeam"]),
    createEvent() {
      console.log(this.eventData);
    },
    displayModals(command) {
      console.log(command);
      if (command == "add_event") {
        this.modals.createEvent = true;
      } else {
        this.modals.editEvent = true;
      }
    }
  },
  mixins: [dates],

  components: {
    VueCal,
    EmployeeTableUnit: () => import("./components/EmployeeTableUnit"),
    Title: () => import("@/components/Title")
  }
};
</script>

<style lang="scss" scoped>
.view_indicator {
  text-transform: capitalize;
}
.sidebar {
  background: rgb(253, 253, 253);
  height: 100vh;
}
span {
  font-size: 1.2em;
}
.vuecal {
  box-shadow: none;
}
.checkbox {
  text-transform: capitalize;
}
.view_indicator {
  color: #2f74eb;
}
.time_wrapper {
  background: rgb(253, 253, 253);
  color: #999;
  border-radius: 40px;
  font-size: 0.9em;
}
.icon {
  cursor: pointer;
}
</style>
