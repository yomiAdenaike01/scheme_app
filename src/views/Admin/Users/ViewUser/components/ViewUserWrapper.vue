<template>
  <div class="view_user_container">
    <!-- Display the avatar -->
    <div class="title_container flex align-center">
      <h2 :style="{ color: getDefaultColour }">
        <i :style="{ color: getDefaultColour }" class="bx bx-user mr-2"></i>
        User management
      </h2>
    </div>
    <div class="avatar_info_container flex_center columns">
      <el-badge
        is-dot
        :type="badgeType"
        class="dot_container"
      >
        <Avatar class="sidebar_avatar full" :name="returnUsername" />
      </el-badge>
      <h3 class="mt-4 mb-2 capitalize">{{ returnUsername }}</h3>
      <h4 class="grey">{{ returnGroupName }}</h4>
    </div>
    <el-tabs
      tab-position="top"
      type="card"
      stretch
      class="tab_container"
      v-model="selectedTab"
    >
      <el-tab-pane
        class="h-100"
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
    ...mapGetters(["getDefaultColour"]),
    badgeType(){
      return this.userData?.isOnline ? 'success' : 'danger'
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
    Avatar
  }
};
</script>
<style lang="scss" scoped>
.title_container {
  background: $hover_grey;
  margin: 10px 0;
  padding: 20px;
}
.avatar_info_container {
  padding: 20px;
  margin-bottom: 20px;
}
.dot_container {
  &/deep/ {
    .el-badge__content {
      width: 12px;
      height: 12px;
      margin: 0;
    }
  }
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
