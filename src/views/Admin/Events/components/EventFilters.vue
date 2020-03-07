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
          v-model="localFilters[key]"
          v-for="(group, key) in groups"
          :key="key"
          :placeholder="`Select ${placeholders[key].name}`"
          class="mt-3"
          size="small"
        >
          <el-option
            v-for="item in group"
            :key="item.value"
            :value="item.value"
            :label="item.name"
          ></el-option>
        </el-select>
      </div>
      <el-button size="mini" class="mt-3" round type="primary"
        >Reset filters</el-button
      >
    </div>
  </el-col>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "EventFilters",
  props: {
    view: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedTeamMember: "",
      displayState: false,
      localFilters: {}
    };
  },

  computed: {
    ...mapState("Admin", ["teamInformation"]),
    ...mapState(["clientInformation"]),
    ...mapState("Admin", ["eventFilters"]),
    /**
     * display placeholders based on the group names
     */
    placeholders() {
      return {
        userGroup: {
          name: "user group"
        },
        eventGroup: {
          name: "event group"
        }
      };
    },

    groups() {
      let groups = {
        userGroup: {},
        eventGroup: {}
      };

      if (this.hasEntries(this.clientInformation)) {
        groups.userGroup = this.clientInformation.userGroups;
        groups.eventGroup = this.clientInformation.eventGroups;
      }
      return groups;
    }
  },
  methods: {
    ...mapActions("Admin", ["getEvents"])
  },
  watch: {
    localFilters({ userGroup = 0, eventGroup = 0 }) {
      this.getEvents({ userGroup, eventGroup });
    }
  }
};
</script>

<style lang="scss" scoped>
.filters_container {
  flex: 0.15;
  background: rgb(252, 252, 252);
  border-right: 1px solid #efefef;
  border-top: 1px solid #efefef;

  position: relative;
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
