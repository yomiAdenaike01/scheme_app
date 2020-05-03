<template>
  <div class="profile_container">
    <!-- Display the avatar -->
    <TextDisplay
      :display-text="{
        heading: 'Profile Management',
        content:
          'This contains all the information about the user, including all the events that they have done'
      }"
    />
    <div class="profile_info_wrapper">
      <div class="avatar_info_container">
        <Avatar :size="100" class="sidebar_avatar full" :name="returnUsername">
          <OnlineIndicator :is-online="online" />
        </Avatar>
        <div class="profile_info_text">
          <h3 class="capitalize">{{ returnUsername }}</h3>
          <p class="grey">
            {{
              userData.user_group.label
                ? userData.user_group.label
                : "No group found"
            }}
          </p>
        </div>
      </div>
    </div>
    <el-tabs
      v-model="selectedTab"
      tab-position="top"
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
    TextDisplay: () => import("@/components/TextDisplay"),
    OnlineIndicator: () => import("@/components/OnlineIndicator")
  },
  props: {
    tabItems: {
      type: Array,
      default: null
    },
    currentTab: {
      type: String,
      required: true
    },
    userData: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapGetters(["getDefaultColour"]),

    online() {
      return this.userData?.is_online ?? false;
    },
    returnUsername() {
      return this.userData?.name ?? "Username";
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
  text-align: center;
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

.slot_container {
  height: 100%;
  overflow-x: hidden;
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
.floating_item {
  @include floating_item;
  background: white;
  padding: 0;
  width: 20px;
  height: 20px;
  top: 10px;
  right: 10px;
  padding: 2px;
}
.online_container {
  background: rgb(1, 175, 1);
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
