<template>
  <el-col class="filters_container p-3 mr-1">
    <div class="inner_filter_container">
      <div class="title_container">
        <h4>Filters</h4>
        <small class="grey filter_desc"
          >Select from dropdowns to filter the schedule.</small
        >
        <el-select
          v-for="(group, key) in groups"
          :key="key"
          v-model="localFilters[key]"
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
import { mapState, mapActions, mapGetters } from "vuex";
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
      localFilters: {}
    };
  },

  computed: {
    ...mapState("Admin", ["teamInformation"]),
    ...mapState(["clientInformation"]),
    ...mapState("Admin", ["eventFilters"]),
    ...mapGetters("Admin", ["getUserGroups"]),
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
        groups.userGroup = this.getUserGroups;
        groups.eventGroup = this.clientInformation.eventGroups;
      }
      return groups;
    }
  },
  methods: {
    ...mapActions("Admin", ["getEvents"])
  },
  watch: {
    localFilters(val = { userGroup: 0, eventGroup: 0 }) {
      console.log(val);
      this.getEvents(val);
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
</style>
