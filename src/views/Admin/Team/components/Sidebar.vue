<template>
  <div class="tab_wrapper">
    <!-- Display the avatar -->
    <div class="avatar_info_container">
      <Avatar :name="returnUsername" class="sidebar_avatar mb-3" />
      <h4>{{ returnUsername }}</h4>
    </div>
    <el-tabs tab-position="left" v-model="selectedTab">
      <el-tab-pane
        :key="index"
        v-for="(tab, index) in tabItems"
        :label="tab.label"
      >
        <slot></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Avatar from "@/components/Avatar";
export default {
  name: "Sidebar",
  data() {
    return {
      selectedTab: ""
    };
  },
  props: {
    teamMemberData: {
      type: Object | Array
    },
    tabItems: {
      type: Array,
      default: null
    }
  },
  computed: {
    returnUsername() {
      return this.teamMemberData.name;
    }
  },
  components: {
    Avatar
  },
  watch: {
    selectedTab(val) {
      this.$emit("changedTab", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.sidebar_avatar {
  width: 60px;
  height: 60px;
  font-size: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar_info_container {
  padding: 1em;
}
</style>
