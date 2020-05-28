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
      <el-popover v-model="popup" trigger="click" width="300">
        <Notifications />
        <div slot="reference" class="button_container">
          <s-button class="small only_icon rounded" icon="bell"></s-button>
          <div class="count_container">
            {{ unreadNotifications.length }}
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import Avatar from "@/components/Avatar";
import Notifications from "@/modules/notifications/Notifications";
import Dropdown from "@/components/Dropdown";
import SButton from "@/components/SButton";

export default {
  name: "CommonBar",
  components: {
    Avatar,
    Dropdown,
    Notifications,
    SButton
  },
  props: {
    displayNotifications: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState(["userInformation", "viewMobileMenu", "apiNotifications"]),
    ...mapGetters(["unreadNotifications"]),

    popup: {
      get() {
        return this.displayNotifications;
      },
      set(val) {
        this.$emit("closeNotifications");
      }
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
    ...mapMutations(["DELETE_USER_SESSION", "UPDATE_TOGGLE_MOBILE_MENU"]),
    ...mapActions(["request", "logOut"]),

    handleCommands(command) {
      switch (command) {
        case "view_profile": {
          this.$router.push({
            name: "team",
            params: { user: this.userInformation.name }
          });
          break;
        }

        case "log_out": {
          this.logOut();
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
  border-bottom: $border;
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

.button_container {
  position: relative;
  .count_container {
    position: absolute;
    right: -14px;
    bottom: -8px;
    z-index: 2;
    background: rgba(var(--colour_secondary), 1);
    color: white;
    border: 4px solid white;
    border-radius: 50%;
    padding: 3px 5px;
    font-size: 0.7em;
  }
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
