<template>
  <el-row type="flex" :gutter="10" class="infobar_wrapper" align="middle">
    <el-col class="client_indicator" :style="{ borderRight: `1.5px solid #efefef` }">
      <div class="client_image_container p-2" v-if="$mq == 'lg'">
        <ClientImage :responsive="true" :center="true" />
      </div>
      <div v-else class="nav_toggle" @click="UPDATE_TOGGLE_MOBILE_MENU(!viewMobileMenu)">
        <i class="el-icon el-icon-menu"></i>
      </div>
    </el-col>
    <el-col>
      <div class="profile_container">
        <Dropdown :items="items" @method="handleCommands" :icon="false">
          <Avatar :name="userInformation.name" />
        </Dropdown>
        <el-badge :value="notificationsLength" class="item ml-2 mt-1 primary">
          <Popover width="350" trigger="click" traisition="el-collapse-transition">
            <div class="notifications_center" slot="content">
              <NotificationManager />
            </div>
            <el-button slot="trigger" size="small" circle icon="el-icon-bell trigger"></el-button>
          </Popover>
        </el-badge>
      </div>
    </el-col>

    <Settings :display="displaySettings" @toggle="displaySettings = $event" />
  </el-row>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import Dropdown from "@/components/Dropdown";
import Settings from "@/views/Settings/Settings";
import Avatar from "./Avatar.vue";
import ClientImage from "@/components/ClientImage";
import Popover from "@/components/Popover";
import NotificationManager from "@/components/NotificationManager";
export default {
  name: "AppBar",
  data() {
    return {
      displaySettings: false
    };
  },
  computed: {
    ...mapState([
      "userInformation",
      "userNotifications",
      "viewMobileMenu",
      "client"
    ]),

    ...mapGetters(["getClientColours", "getClient", "getSidebarColour"]),

    notificationsLength() {
      return this.userNotifications.filter(notification => {
        console.log(notification);
        return (
          notification.status != "is_read" &&
          notification.status != "is_complete"
        );
      }).length;
    },

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
          name: "View Notifications",
          command: "view_notifications"
        },
        {
          name: "Settings",
          command: "settings",
          divided: true
        },
        {
          name: "Help",
          command: "support",
          divided: true,
          icon: "el-icon-bangzhu"
        },
        {
          name: "Log Out",
          command: "log_out",
          divided: true,
          icon: "el-icon-switch-button"
        }
      ];
    }
  },
  methods: {
    ...mapMutations([
      "REMOVE_USER",
      "UPDATE_GLOBAL_LOADER",
      "UPDATE_VIEW_NOTIFICATIONS_CENTER",
      "UPDATE_TOGGLE_MOBILE_MENU"
    ]),

    ...mapActions(["request"]),
    handleCommands(command) {
      switch (command) {
        case "view_notifications": {
          this.UPDATE_VIEW_NOTIFICATIONS_CENTER(true);
          break;
        }
        case "log_out": {
          this.UPDATE_GLOBAL_LOADER(true);
          this.request({
            method: "GET",
            url: "users/logout"
          })
            .then(response => {
              this.REMOVE_USER();
              this.$router.push({ name: "login" });
            })
            .catch(error => {
              this.UPDATE_GLOBAL_LOADER(false);
            });
          break;
        }
        case "settings": {
          this.displaySettings = true;
          break;
        }

        case "support": {
          this.$router.push({ name: "supportCentre" });
          break;
        }

        default:
          break;
      }
    }
  },
  components: {
    Dropdown,
    Settings,
    Avatar,
    ClientImage,
    Popover,
    NotificationManager
  }
};
</script>
<style lang="scss" scoped>
.client_indicator {
  color: white;
  height: 100%;
  text-transform: capitalize;
  max-width: 7.4%;
}
.infobar_wrapper {
  border-bottom: solid 1px #e6e6e6;
  box-shadow: $box_shadow;
}
.nav_toggle {
  cursor: pointer;
  background: transparent;
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
  display: flex;
  justify-content: flex-end;
  width: 95%;
  align-items: center;
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
