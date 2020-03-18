<template>
  <div
    id="app"
    v-resize-text="defaultSize"
    :class="{ mobile: $mq != 'lg' }"
    v-loading="loading"
    element-loading-background="rgba(255, 255, 255, 1)"
    element-loading-text="
      Loading
    client instance please wait....
    "
  >
    <DefaultTransition>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </DefaultTransition>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import alterTheme from "@/mixins/alterTheme";
import DefaultTransition from "@/components/DefaultTransition";
export default {
  name: "app",
  data() {
    return {
      clientInterval: null,
      loading: true
    };
  },
  created() {
    this.loggerController();
    if (this.getIsIE) {
      alert(
        "Your browser is IE11, we do not support this browser and suggest movement towards a more modern browser i.e. Google chrome, we apologise for the inconvinience"
      );
    }

    if (this.isValidClient) {
      this.SET_THEME();
    }
    clearInterval(this.clientInterval);
    this.clientInterval = setInterval(() => {
      let res = this.getClient()
        .then(response => {
          this.loading = false;
        })
        .catch(err => {
          console.error(err);
          this.loading = false;
        });
    }, this.requestIntervals.client);
  },
  destroyed() {
    clearInterval(this.clientInterval);
  },
  computed: {
    ...mapState([
      "requestIntervals",
      "notifications",
      "userInformation",
      "defaultSize",
      "clientInformation",
      "criticalNetworkError",
      "invalidClient"
    ]),
    ...mapState("Admin", ["teamInformation", "shifts"]),
    ...mapGetters(["getIsIE"]),

    isValidClient() {
      return this.hasEntries(this.clientInformation);
    }
  },
  mixins: [alterTheme],
  methods: {
    ...mapActions(["request", "getClient"]),
    ...mapMutations(["SET_THEME"]),
    loggerController() {
      if (process.env.NODE_ENV != "development") {
        window.console.log = function() {};
        window.console.warn = function() {};
        window.console.error = function() {};
      }
    }
  },
  components: {
    DefaultTransition
  },

  watch: {
    "clientInformation.colours"(val) {
      this.mutateTheme(val);
    },
    notifications(val) {
      this.$notify(val[0]);
    },
    criticalNetworkError(val) {
      if (val) {
        clearInterval(this.clientInterval);
      }
    }
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
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
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
.desc {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}

.bold {
  font-weight: bold;
}
.grey {
  color: #999;
}
.black {
  color: black;
}
.error {
  color: $error_colour;
}
.primary {
  color: $element_colour;
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
.txt-large {
  font-size: 1.3em;
}
.l-height-large {
  line-height: 1.6em;
}

.shadow_border {
  border-radius: 50%;
  padding: 6px;
  box-shadow: $box_shadow;
}
.member_name {
  text-transform: capitalize;
}
.client_error_dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .button_container {
    display: flex;
    justify-content: space-between;
  }
  .client_name {
    width: 80%;
  }
}
.rounded_image {
  border-radius: 10px;
}

/*
 
   ____                _               
  | __ )  ___  _ __ __| | ___ _ __ ___ 
  |  _ \ / _ \| '__/ _` |/ _ \ '__/ __|
  | |_) | (_) | | | (_| |  __/ |  \__ \
  |____/ \___/|_|  \__,_|\___|_|  |___/
                                       
 
*/
.bordered {
  border: 2px solid whitesmoke;
}
.borderless {
  border: none;
}

/*
 
   ____           _ _   _             _             
  |  _ \ ___  ___(_) |_(_) ___  _ __ (_)_ __   __ _ 
  | |_) / _ \/ __| | __| |/ _ \| '_ \| | '_ \ / _` |
  |  __/ (_) \__ \ | |_| | (_) | | | | | | | | (_| |
  |_|   \___/|___/_|\__|_|\___/|_| |_|_|_| |_|\__, |
                                              |___/ 
 
*/
.flex {
  display: flex;
}
.flex--center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
.align-end {
  align-items: flex-end;
}
.flex--space-between {
  justify-content: space-between;
}
.flex-1 {
  flex: 1;
}
.flex--start {
  justify-content: flex-start;
}
.flex--end {
  justify-content: flex-end;
}
.align-end {
  align-items: flex-end;
}
.align-start {
  align-items: flex-start;
}
.flex_center {
  justify-content: center;
  display: flex;
  align-items: center;
}
.posr {
  position: relative;
}
.posa {
  position: absolute;
}
.w-100 {
  flex: 1;
  width: 100%;
}

.h-100 {
  height: 100%;
}
.h-90 {
  height: 90%;
}
.large_icon {
  font-size: 3em;
}
.medium_icon {
  font-size: 2em;
}

.w-50 {
  width: 50%;
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
  transition: all 0.5s;
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
  opacity: 0.5;
  cursor: not-allowed;
  &.line-through {
    text-decoration: line-through;
  }
}

.logo {
  padding: 5px 19px;
  border-radius: 50%;
  background-image: linear-gradient(
    340deg,
    $default_colour 0%,
    $element_colour 100%
  );

  color: white;
  font-weight: bold;
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
  border-radius: 10px;
  padding: 0;
  width: 60%;
  &/deep/ {
    .el-dialog__body {
      padding: 0;
    }
  }
}
.el-card__body {
  height: 100%;
  overflow-x: scroll;
}

//   _   _       _   _  __ _           _   _
//  | \ | |     | | (_)/ _(_)         | | (_)
//  |  \| | ___ | |_ _| |_ _  ___ __ _| |_ _  ___  _ __  ___
//  | . ` |/ _ \| __| |  _| |/ __/ _` | __| |/ _ \| '_ \/ __|
//  | |\  | (_) | |_| | | | | (_| (_| | |_| | (_) | | | \__ \
//  |_| \_|\___/ \__|_|_| |_|\___\__,_|\__|_|\___/|_| |_|___/

.custom_notification_icon {
  color: #909399;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 50%;
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
