<template>
  <el-row type="flex" :gutter="10" class="infobar_wrapper" align="middle">
    <el-col class="client_indicator">
      <div class="client_image_wrapper flex_center" v-if="$mq == 'lg'">
        <ClientImage :responsive="true" />
      </div>
      <div v-else class="nav_toggle" @click="UPDATE_TOGGLE_MOBILE_MENU(!viewMobileMenu)">
        <i class="el-icon el-icon-menu"></i>
      </div>
    </el-col>
    <el-col>
      <div class="profile_container">
        <Dropdown :items="items" @method="handleCommands" :icon="false">
          <Avatar :name="currentUser.name"></Avatar>
        </Dropdown>
        <el-badge :value="userNotifications.length" class="item ml-2 mt-1 primary">
          <el-button
            size="small"
            @click="UPDATE_VIEW_NOTIFICATIONS_CENTER(true)"
            circle
            icon="el-icon-bell trigger"
          ></el-button>
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
import prompts from "@/mixins/prompts";
import ClientImage from "@/components/ClientImage";
export default {
  name: "AppBar",
  data() {
    return {
      displaySettings: false
    };
  },
  computed: {
    ...mapState([
      "currentUser",
      "userNotifications",
      "viewMobileMenu",
      "client"
    ]),

    ...mapGetters(["getCompanyColours", "getClient"]),
    getPrimaryColour() {
      return this.getCompanyColours.find(colour => {
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

        default:
          break;
      }
    }
  },
  components: {
    Dropdown,
    Settings,
    Avatar,
    ClientImage
  },
  mixins: [prompts]
};
</script>
<style lang="scss" scoped>
.client_indicator {
  color: white;
  height: initial;
  text-transform: capitalize;
  max-width: 7.4%;
  border-right: 1.5px solid #efefef;
}
.infobar_wrapper {
  border-bottom: solid 1px #e6e6e6;
}
.nav_toggle {
  cursor: pointer;
  background: transparent;
}
.el-col {
  height: 100%;
}
.client_container {
  //   flex: 0.1;
  background: $primary_colour;
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
