<template>
  <el-col class="filters_container p-3 mr-1" :class="{ active: displayState }">
    <div
      class="hide_show_indicator shadow pl-3 pr-3 pt-2 pb-2"
      @click="displayState = !displayState"
    >
      <i
        class="el-icon-arrow-right active_arrow"
        :class="{ ' el-icon-arrow-left': !displayState }"
      ></i>
    </div>
    <div class="inner_filter_container" :class="{ active: displayState }">
      <div class="title_container">
        <h4>Filters</h4>
        <small class="grey filter_desc"
          >Select from dropdowns to filter the schedule.</small
        >

        <el-select
          size="small"
          v-model="selectedTeamMember"
          placeholder="Filter by team member"
          class="mb-3 mt-3"
        >
          <el-option
            v-for="member in team"
            :key="member._id"
            :value="member._id"
            :label="member.name"
          ></el-option>
        </el-select>

        <el-select
          v-model="selectedTeamMember"
          size="small"
          placeholder="Filter by group"
        >
          <el-option
            v-for="item in groups"
            :key="item.value"
            :value="item.value"
            :label="item.name"
          ></el-option>
        </el-select>
      </div>
    </div>
  </el-col>
</template>

<script>
import Title from "@/components/Title";
import Nocontent from "@/components/Nocontent";
import Tabs from "@/components/Tabs";
import shiftTypes from "@/mixins/shiftTypes";
import { mapGetters, mapState } from "vuex";

export default {
  name: "ScheduleFilters",
  mixins: [shiftTypes],

  data() {
    return {
      localFilters: {},
      selectedTeamMember: "",
      displayState: false
    };
  },

  computed: {
    ...mapState("Admin", ["team"]),
    ...mapState(["clientInformation"]),

    groups() {
      let groups = [
        {
          name: "Admins",
          value: 1
        },
        {
          name: "General Staff",
          value: 2
        }
      ];

      if ("userGroups" in this.clientInformation) {
        groups = this.clientInformation.userGroups;
      }

      return groups;
    },
    filters() {
      return [
        {
          name: "",
          value: ""
        }
      ];
    }
  },

  props: {
    view: {
      type: Boolean,
      default: false
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
  transition: 0.56s ease-out width;
  width: 10%;
  background: rgb(252, 252, 252);
  border-right: 1px solid #efefef;
  position: relative;

  &.active {
    width: 0;
  }
}
.filter_desc {
  font-size: 0.7em;
}
.hide_show_indicator {
  position: absolute;
  top: 50%;
  right: -20px;
  border-radius: 40px;
  z-index: 4;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &.active_arrow {
    right: -100px;
  }
}
.inner_filter_container {
  &.active {
    visibility: hidden;
  }
}
</style>
