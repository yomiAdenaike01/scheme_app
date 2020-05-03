<template>
  <div class="appbar_container">
    <div
      v-if="$mq != 'lg'"
      class="nav_toggle"
      @click="UPDATE_TOGGLE_MOBILE_MENU(!viewMobileMenu)"
    >
      <i class="el-icon el-icon-menu"></i>
    </div>
    <div class="appbar_inner_container">
      <Dropdown :items="items" :icon="false" @method="handleCommands">
        <Avatar class="profile_avatar" :name="userInformation.name" />
      </Dropdown>
      <el-popover :options="{ placement: 'right' }" trigger="click">
        <Notifications />
        <el-button
          slot="reference"
          size="small"
          circle
          icon="el-icon-bell trigger"
        ></el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

import Avatar from "@/components/Avatar";
import Notifications from "@/modules/notifications/Notifications";
import Dropdown from "@/components/Dropdown";

export default {
  name: "CommonBar",
  components: {
    Avatar,
    Dropdown,
    Notifications
  },
  computed: {
    ...mapState(["userInformation", "viewMobileMenu", "apiNotifications"]),

    items() {
      return [
        {
          name: "<i class='bx bx-user'></i> Profile",
          command: "view_profile"
        },

        {
          name: "Log Out",
          command: "log_out",
          divided: true
        }
      ];
    }
  },
  methods: {
    ...mapMutations(["DELETE_USER_SESSION", "UPDATE_TOGGLE_MOBILE_MENU"]),
    ...mapMutations(["UPDATE_OVERLAY_INDEX"]),

    ...mapActions(["request"]),
    handleCommands(command) {
      switch (command) {
        case "view_profile": {
          this.UPDATE_OVERLAY_INDEX({
            overlay: "profile",
            view: true,
            data: this.userInformation
          });
          break;
        }

        case "log_out": {
          this.request({
            method: "GET",
            url: "users/logout"
          }).then(() => {
            this.DELETE_USER_SESSION();
          });
          break;
        }

        default:
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.appbar_container {
  display: flex;
  flex: 1;
  padding: 10px;
  max-height: $app_bar_height;
  border-bottom: 2px solid whitesmoke;
}
.client_indicator {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  color: white;
  text-transform: capitalize;
}

.nav_toggle {
  background: transparent;
  cursor: pointer;
}

.appbar_inner_container {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  margin-right: 30px;
}
.profile_avatar {
  margin-right: 10px;
}
.popover_container {
  &/deep/ {
    .el-el-popover {
      padding: 0;
    }
  }
}

.search {
  margin-left: 10px;
}
/**
 _   _  _  ___ _  _    ___ 
| \_/ |/ \| o ) || |  | __|
| \_/ ( o ) o \ || |_ | _| 
|_| |_|\_/|___/_||___||___|
                                                                                    
 */
.mobile {
  .appbar_container {
    padding: 0.6rem;
  }
  .client_indicator {
    background: none;
    color: #cacaca;
    font-size: 1.4em;
  }
}
</style>
