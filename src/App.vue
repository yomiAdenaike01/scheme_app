<template>
  <div
    id="app"
    v-resize-text="defaultSize"
    v-loading="loading"
    :class="{ mobile: $mq != 'lg' }"
    element-loading-text="Loading client instance please wait...."
  >
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  data() {
    return {
      clientInterval: null,
      loading: true
    };
  },
  computed: {
    ...mapState([
      "requestIntervals",
      "notifications",
      "defaultSize",
      "clientInformation",
      "criticalNetworkError"
    ]),
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters(["getIsIE"]),

    isValidClient() {
      return this.hasEntries(this.clientInformation);
    }
  },
  watch: {
    notifications(val) {
      if (val?.length > 0) {
        this.$notify(val[0]);
      }
    }
  },

  created() {
    window.console.warn = function() {};
    if (this.getIsIE) {
      alert(
        "Your browser is Internet explorer, we do not support this browser and suggest movement towards a more modern browser i.e. Google chrome, we apologise for the inconvinience"
      );
    }

    let currentHostname = window.location.hostname.toString().split(".");
    let subdomain = currentHostname[0];

    this.CREATE_GLOBAL_INTERVAL({
      immediate: true,
      method: () => {
        return new Promise((resolve, reject) => {
          this.request({
            method: "GET",
            url: "clients/get",
            params: { subdomain }
          })
            .then(response => {
              this.UPDATE_CLIENT_INFORMATION(response);
              this.loading = false;
              resolve();
            })
            .catch(() => {
              this.loading = false;
              reject();
            });
        });
      },
      ...this.requestIntervals.client
    });
  },

  beforeDestroy() {
    this.CLEAR_GLOBAL_INTERVAL();
    this.REMOVE_USER();
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations([
      "REMOVE_USER",
      "CREATE_GLOBAL_INTERVAL",
      "CLEAR_GLOBAL_INTERVAL",
      "UPDATE_CLIENT_INFORMATION",
      "CLEAR_NOTIFICATIONS"
    ])
  }
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Sen|Source+Sans+Pro&display=swap");

* {
  font-family: "Sen", sans-serif !important;
}

body,
html,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app {
  display: flex;
  flex: 1;
  overflow-x: hidden;
}
/*
 
   _____         _         _         _           
  |_   _|____  _| |_   ___| |_ _   _| | ___  ___ 
    | |/ _ \ \/ / __| / __| __| | | | |/ _ \/ __|
    | |  __/>  <| |_  \__ \ |_| |_| | |  __/\__ \
    |_|\___/_/\_\\__| |___/\__|\__, |_|\___||___/
                               |___/             
 
*/
h1,
h2,
h3,
h4,
h5,
h6,
p,
span {
  font-weight: 300;
  margin: 0;
  padding: 0;
}

.grey {
  color: #999;
}

.columns {
  flex-direction: column;
}
.caps {
  text-transform: uppercase;
}
.capitalize {
  text-transform: capitalize;
}

.slot_container {
  margin: 10px;
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.no_padding {
  padding: 0 !important;
}

/*
 
   _____                    _ _   _                 
  |_   _| __ __ _ _ __  ___(_) |_(_) ___  _ __  ___ 
    | || '__/ _` | '_ \/ __| | __| |/ _ \| '_ \/ __|
    | || | | (_| | | | \__ \ | |_| | (_) | | | \__ \
    |_||_|  \__,_|_| |_|___/_|\__|_|\___/|_| |_|___/
                                                    
 
*/
.fade-transform-leave-active,
.fade-transform-enter-active {
  will-change: transform;
  transition: transform 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  &.line-through {
    text-decoration: line-through;
  }
}

.logo {
  background-image: linear-gradient(
    340deg,
    $default_colour 0%,
    $element_colour 100%
  );
  border-radius: 50%;

  color: white;
  font-weight: bold;
  padding: 5px 19px;
}
.overflow {
  overflow: auto;
}

.rounded {
  border-radius: $border_radius;
}
.shadow {
  box-shadow: $box_shadow;
}
.txt_center {
  text-align: center;
}

.no_events {
  pointer-events: none;
}

.popover_container {
  padding: 0;
}
.popover_item {
  &.no_events {
    opacity: 0.4;
  }
  &:hover {
    background: $hover_grey;
  }
}

.el-dialog {
  border-radius: 10px !important;
  padding: 10px 0 !important;
  width: 50% !important;
  &/deep/ {
    .el-dialog__body {
      padding: 0 !important;
    }
  }
}
.el-card__body {
  height: 100%;
  overflow-x: scroll;
}
.el-tabs--border-card {
  background: #ffffff;
  border-top: 1px solid #dcdfe6;
  border-bottom: none !important;
  border-left: none !important;
  border-right: none !important;
  box-shadow: none !important;
}
.el-dialog__wrapper {
  background: rgba(42, 54, 59, 0.01);
}

//   _   _       _   _  __ _           _   _
//  | \ | |     | | (_)/ _(_)         | | (_)
//  |  \| | ___ | |_ _| |_ _  ___ __ _| |_ _  ___  _ __  ___
//  | . ` |/ _ \| __| |  _| |/ __/ _` | __| |/ _ \| '_ \/ __|
//  | |\  | (_) | |_| | | | | (_| (_| | |_| | (_) | | | \__ \
//  |_| \_|\___/ \__|_|_| |_|\___\__,_|\__|_|\___/|_| |_|___/

.custom_notification_icon {
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  color: #909399;
  padding: 10px;
}
/**
    _   _  _  ___ _  _    ___
    | \_/ |/ \| o ) || |  | __|
    | \_/ ( o ) o \ || |_ | _|
    |_| |_|\_/|___/_||___||___|
  
  */
.mobile {
  overflow: scroll;
  .el-dialog {
    width: 100%;
  }
  .el-drawer__body {
    overflow-y: scroll;
  }
}
.trigger {
  cursor: pointer;
}
</style>
