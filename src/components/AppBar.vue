<template>
  <el-row type="flex" :gutter="10" class="infobar_wrapper" align="middle">
    <el-col
      class="client_indicator"
      :style="{ borderRight: `1.5px solid #efefef` }"
    >
      <div v-if="$mq == 'lg'" class="client_image_container">
        <Logo />
      </div>
      <div
        v-else
        class="nav_toggle"
        @click="UPDATE_TOGGLE_MOBILE_MENU(!viewMobileMenu)"
      >
        <i class="el-icon el-icon-menu"></i>
      </div>
    </el-col>
    <el-col>
      <div class="profile_container">
        <Dropdown :items="items" :icon="false" @method="handleCommands">
          <Avatar :name="userInformation.name" />
        </Dropdown>
        <el-badge
          :value="getUserNotificationsLength"
          class="item ml-2 mt-1 primary"
        >
          <Popover
            width="350"
            trigger="click"
            traisition="el-collapse-transition"
          >
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
    </el-col>
  </el-row>
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
.client_indicator {
  color: white;
  height: 100%;
  max-width: 7.4%;
  text-transform: capitalize;
}
.infobar_wrapper {
  border-bottom: solid 1px #e6e6e6;
  box-shadow: $box_shadow;
  max-height: $app_bar_height;
}
.nav_toggle {
  background: transparent;
  cursor: pointer;
}
.el-col {
  height: 100%;
}
.client_container {
  background: $element_colour;
  color: white;
}
.username {
  text-transform: capitalize;
}
.border {
  border-left: 1px solid #e6e6e6;
}
.profile_container {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 95%;
}
.text_wrapper {
  font-size: 0.9em;
}
.popover_container {
  &/deep/ {
    .el-popover {
      padding: 0;
    }
  }
}
.client_image_container {
  display: flex;
  padding: 5px;
  justify-content: center;
}
/**
 _   _  _  ___ _  _    ___ 
| \_/ |/ \| o ) || |  | __|
| \_/ ( o ) o \ || |_ | _| 
|_| |_|\_/|___/_||___||___|
                                                                                    
 */
.mobile {
  .infobar_wrapper {
    padding: 0.6rem;
  }
  .client_indicator {
    background: none;
    color: #cacaca;
    font-size: 1.4em;
  }
}
</style>
