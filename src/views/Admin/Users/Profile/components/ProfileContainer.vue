<template>
  <div class="profile_container">
    <!-- Display the avatar -->
    <InformationDisplay
      :display-text="{
        heading: 'Profile Management',
        content:
          'This contains all the information about the user, including all the events that they have done'
      }"
    />
    <div class="profile_info_wrapper">
      <div class="avatar_info_container">
        <el-badge is-dot :type="badgeType" class="dot_container">
          <Avatar class="sidebar_avatar full" :name="returnUsername" />
        </el-badge>
        <div class="profile_info_text">
          <h3 class="capitalize">{{ returnUsername }}</h3>
          <h4 class="grey">{{ returnGroupName }}</h4>
        </div>
      </div>
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
        :label="tab.label"
      >
        <div class="slot_container">
          <slot></slot>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ProfileContainer",
  components: {
    Avatar: () => import("@/components/Avatar"),
    InformationDisplay: () => import("@/components/InformationDisplay")
  },
  props: {
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
    ...mapGetters("Admin", ["getGroupName", "getUserInformation"]),
    ...mapGetters(["getDefaultColour", "getActiveDialog"]),
    userData() {
      return this.getActiveDialog("profile")?.data;
    },
    badgeType() {
      return this.userData?.isOnline ? "success" : "danger";
    },
    returnUsername() {
      return this.userData?.name ?? "Username";
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
  }
};
</script>
<style lang="scss" scoped>
.title_container {
  margin: 10px 0;
  padding: 20px;
}
.profile_info_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.profile_info_text {
  margin-top: 20px;
}
.avatar_info_container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
}
.capitalize {
  font-weight: 400;
  font-size: 1.3em;
  margin: 0;
  padding: 0;
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
