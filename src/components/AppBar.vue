<template>
  <div class="appbar_container">
    <div
      v-if="$mq != 'lg'"
      class="nav_toggle"
      @click="UPDATE_TOGGLE_MOBILE_MENU(!viewMobileMenu)"
    >
      <i class="el-icon el-icon-menu"></i>
    </div>
    <div class="profile_container">
      <Dropdown :items="items" :icon="false" @method="handleCommands">
        <Avatar class="profile_avatar" :name="userInformation.name" />
      </Dropdown>
      <el-badge :value="getUserNotificationsLength" class="item primary">
        <el-popover width="350" trigger="click">
          <div class="notifications_center">
            <NotificationModule />
          </div>
          <el-button
            slot="reference"
            size="small"
            circle
            icon="el-icon-bell trigger"
          ></el-button>
        </el-popover>
      </el-badge>
      <el-button
        size="small"
        circle
        class="search"
        icon="el-icon-search"
        @click="$emit('runSearch', true)"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  name: "AppBar",
  components: {
    Avatar: () => import("@/components/Avatar"),
    Dropdown: () => import("@/components/Dropdown"),
    NotificationModule: () => import("@/components/NotificationModule")
  },
  computed: {
    ...mapState(["userInformation", "viewMobileMenu"]),

    ...mapGetters(["getUserNotificationsLength"]),

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
            dialog: "profile",
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
  max-height: $app_bar_height;
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
