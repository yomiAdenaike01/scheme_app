<template>
  <div class="appbar_container">
    <div v-if="$mq == 'lg'" class="scheme_logo_container">
      <Logo />
    </div>
    <div
      v-else
      class="nav_toggle"
      @click="UPDATE_TOGGLE_MOBILE_MENU(!viewMobileMenu)"
    >
      <i class="el-icon el-icon-menu"></i>
    </div>
    <div class="profile_container">
      <Dropdown :items="items" :icon="false" @method="handleCommands">
        <Avatar class="profile_avatar" :name="userInformation.name" />
      </Dropdown>
      <el-badge
        :value="getUserNotificationsLength"
        class="item ml-2 mt-1 primary"
      >
        <Popover width="350" trigger="click">
          <div slot="content" class="notifications_center">
            <NotificationModule />
          </div>
          <el-button
            slot="trigger"
            size="small"
            circle
            icon="el-icon-bell trigger"
          ></el-button>
        </Popover>
      </el-badge>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import Avatar from "./Avatar.vue";

import Dropdown from "@/components/Dropdown";
import Logo from "@/components/Logo";
import Popover from "@/components/Popover";
import NotificationModule from "@/components/NotificationModule";

export default {
  name: "AppBar",
  components: {
    Dropdown,
    Avatar,
    Logo,
    Popover,
    NotificationModule
  },
  computed: {
    ...mapState([
      "userInformation",
      "userNotifications",
      "viewMobileMenu",
      "client"
    ]),

    ...mapGetters([
      "getClientColours",
      "getClient",
      "getSidebarColour",
      "getUserNotificationsLength"
    ]),

    getPrimaryColour() {
      return this.getClientColours.find(colour => {
        return colour.label == "Primary";
      }).colour;
    },
    navWidth() {
      let styleWidth = { width: `${150}px` };
      const navElem = document.getElementById("main_nav");
      if (navElem) {
        const width = navElem.offsetWidth;
        styleWidth.width = `${width}px`;
      }
      return styleWidth;
    },
    notifications() {
      return [
        {
          name: "You have a new message"
        }
      ];
    },
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
    ...mapMutations(["REMOVE_USER", "UPDATE_TOGGLE_MOBILE_MENU"]),
    ...mapMutations(["UPDATE_DIALOG_INDEX"]),

    ...mapActions(["request"]),
    handleCommands(command) {
      switch (command) {
        case "view_profile": {
          this.UPDATE_DIALOG_INDEX({
            dialog: "viewUser",
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
            this.REMOVE_USER();
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

.profile_container {
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
    .el-popover {
      padding: 0;
    }
  }
}
.scheme_logo_container {
  display: flex;
  padding: 5px;
  justify-content: center;
  border-radius: 50%;
  padding: 5px;
  box-shadow: $box_shadow;
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
