<template>
  <div class="view_user_container">
    <!-- Display the avatar -->
    <InformationDisplay
      class="m-5"
      :display-text="{
        heading: 'User management',
        content:
          'This contains all the information about the user, including all the events that they have done'
      }"
    ></InformationDisplay>
    <div class="avatar_info_container flex_center columns">
      <el-badge is-dot :type="badgeType" class="dot_container">
        <Avatar class="sidebar_avatar full" :name="returnUsername" />
      </el-badge>
      <h3 class="mt-4 mb-2 capitalize">{{ returnUsername }}</h3>
      <h4 class="grey">{{ returnGroupName }}</h4>
    </div>
    <el-tabs
      v-model="selectedTab"
      tab-position="top"
      type="card"
      stretch
      class="tab_container"
    >
      <el-tab-pane
        v-for="(tab, index) in tabItems"
        :key="index"
        class="h-100"
        :label="tab.label"
      >
        <slot class="p-4"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Avatar from "@/components/Avatar";
import InformationDisplay from "@/components/InformationDisplay";
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
    ...mapGetters(["getDefaultColour"]),
    badgeType() {
      return this.userData?.isOnline ? "success" : "danger";
    },
    returnUsername() {
      return this.userData?.name;
    },
    returnGroupName() {
      return this.getGroupName("user", this.userData?.groupID)?.name;
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
    Avatar,
    InformationDisplay
  }
};
</script>
<style lang="scss" scoped>
.title_container {
  margin: 10px 0;
  padding: 20px;
}
.avatar_info_container {
  margin-bottom: 20px;
  padding: 20px;
}
.dot_container {
  &/deep/ {
    .el-badge__content {
      height: 12px;
      margin: 0;
      width: 12px;
    }
  }
}
.sidebar_avatar {
  &/deep/ {
    .el-avatar {
      align-items: center;
      display: flex;
      font-size: 1.3em;
      height: 60px;
      justify-content: center;
      text-align: center;
      width: 60px;
    }
  }
}
</style>
