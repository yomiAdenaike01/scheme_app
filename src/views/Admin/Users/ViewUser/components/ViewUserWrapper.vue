<template>
  <div class="view_user_container">
    <!-- Display the avatar -->
    <div class="avatar_info_container flex_center columns">
      <Avatar class="sidebar_avatar full" :name="returnUsername" />
      <h3 class="mt-4 mb-2 capitalize">{{ returnUsername }}</h3>
      <h4 class="grey">{{ returnGroupName }}</h4>
    </div>
    <el-tabs tab-position="top" stretch class="tab_container" v-model="selectedTab">
      <el-tab-pane class="h-100" :key="index" v-for="(tab, index) in tabItems" :label="tab.label">
        <slot></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Avatar from "@/components/Avatar";
import { mapGetters } from "vuex";

export default {
  name: "ViewUserWrapper",

  props: {
    userData: {
      type: Object | Array
    },
    tabItems: {
      type: Array,
      default: null
    },
    currentTab: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters("Admin", ["getGroupName"]),
    returnUsername() {
      return this.userData.name;
    },
    returnGroupName() {
      return this.getGroupName("user", this.userData.groupID).name;
    },
    selectedTab: {
      get() {
        return this.currentTab;
      },
      set(tab) {
        this.$emit("changedTab", tab);
      }
    }
  },
  components: {
    Avatar
  }
};
</script>
<style lang="scss" scoped>
.avatar_info_container {
  background: $hover_grey;
  padding: 20px;
  margin-bottom: 20px;
}
.sidebar_avatar {
  &/deep/ {
    .el-avatar {
      width: 60px;
      height: 60px;
      font-size: 30px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
