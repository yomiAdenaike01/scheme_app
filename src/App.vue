<template>
  <div
    id="app"
    v-loading="loading"
    :class="{ mobile: $mq != 'lg' }"
    element-loading-text="Loading client instance please wait...."
  >
    <fade-transition mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </fade-transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import refactorLocation from "@/mixins/refactorLocation";
import { FadeTransition } from "vue2-transitions";
export default {
  name: "App",
  components: {
    FadeTransition
  },
  mixins: [refactorLocation],
  data() {
    return {
      loading: true,
      dialogShowing: false
    };
  },
  computed: {
    ...mapState(["requestIntervals", "clientInformation"]),
    ...mapState(["team", "overlayIndex"]),
    ...mapGetters(["getIsIE"]),

    isValidClient() {
      return Object.values(this.clientInformation).length > 0;
    }
  },

  created() {
    console.log(document.styleSheets);

    if (this.getIsIE) {
      alert(
        "Your browser is Internet explorer, we do not support this browser and suggest movement towards a more modern browser i.e. Google chrome, we apologise for the inconvinience"
      );
    }

    let currentHostname = window.location.hostname.toString().split(".");
    let subdomain = currentHostname[0];
    this.CREATE_GLOBAL_INTERVAL({
      immediate: true,
      id: "client",
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
            .catch(err => {
              this.loading = false;
              this.DELETE_USER_SESSION();
              if (this.dialogShowing == false) {
                this.genPromptBox({
                  boxType: "prompt",
                  title: "No client found",
                  text:
                    "Please enter your client subdomain to go to your scheme cloud instance",
                  type: "info"
                }).then(({ value }) => {
                  this.refactorWindowLocation(value);
                });
                this.dialogShowing = true;
              }
              reject(err);
            });
        });
      },
      duration: this.requestIntervals.client
    });
  },

  beforeDestroy() {
    this.DELETE_GLOBAL_INTERVAL();
    this.DELETE_USER_SESSION();
  },

  methods: {
    ...mapActions(["request", "genPromptBox"]),
    ...mapMutations([
      "DELETE_USER_SESSION",
      "CREATE_GLOBAL_INTERVAL",
      "DELETE_GLOBAL_INTERVAL",
      "UPDATE_CLIENT_INFORMATION",
      "CLEAR_NOTIFICATIONS"
    ])
  }
};
</script>
<style lang="scss">
.flat_input {
  &/deep/ .el-input__inner {
    padding: 15px;
    font-size: 1em;
    border: none;
    border-radius: 20px;
    background: rgb(249, 249, 249);
  }
}
:root {
  // Primary
  --colour_primary: 74, 85, 100;
  --colour_secondary: 89, 212, 140;

  --colour_grey_light: hsl(0, 0%, 98%);

  --colour_yellow: hsl(23, 100%, 63%);

  --blue: 1, 104, 250;
  --indigo: 91, 71, 251;
  --purple: 111, 66, 193;
  --pink: 241, 0, 117;
  --red: 220, 53, 69;
  --orange: 253, 126, 20;
  --yellow: 255, 193, 7;
  --green: 16, 183, 89;
  --teal: 0, 204, 204;
  --cyan: 0, 184, 212;
  --white: 255, 255, 255;
  --gray: 121, 135, 161;
  --gray-dark: 59, 72, 99;
  --primary: 1, 104, 250;
  --secondary: 59, 72, 99;
  --success: 16, 183, 89;
  --info: 0, 184, 212;
  --warning: 255, 193, 7;
  --danger: 220, 53, 69;
  --light: 244, 245, 248;
  --dark: 59, 72, 99;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: white;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.2);
  border-radius: 20px;
  transition: 0.56s ease-in-out background;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(210, 210, 210);
  cursor: pointer;
}
.input_pill {
  display: flex;
  align-items: center;
  background: white;
  padding: 10px;
  justify-content: space-evenly;
  max-width: fit-content;
  border: $border;
  border-radius: 40px;
  margin: 10px;
  cursor: pointer;
  font-size: 0.9em;
  text-transform: capitalize;
  &.no_pointer {
    cursor: default;
  }
}
/*

Fonts


*/
@import url("https://fonts.googleapis.com/css?family=Jost:400,500,600,700&display=swap");
/*

 Default


*/
* {
  font-family: "Jost", Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  outline: none;

  :before,
  :after {
    -webkit-font-smoothing: antialiased;
  }
}
.el-drawer__body {
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}
body,
html,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}
#app {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}
.no_content {
  display: flex;
  flex: 1;
  flex-direction: column;
  &.center {
    justify-content: center;
    align-items: center;
  }
}

.grey {
  color: #999;
}

.capitalise {
  text-transform: capitalize;
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
.floating_item {
  position: absolute;
  top: -10px;
  right: 0;
  border-radius: 50%;
  background: #efefef;
  padding: 0px 10px;
  z-index: 999;
  color: #888;
  cursor: pointer;
  &:hover {
    background: darken(#efefef, 4);
  }
}
/*

 Element UI Configuration


*/

.el-drawer {
  height: 100%;
}
.el-drawer__body {
  height: calc(100% - 39px);
}
.long {
  width: 100%;
}
.el-collapse-item__header,
.el-collapse-item__wrap {
  border: none !important;
}

.el-popover_item {
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
.el-tabs__item,
button,
input,
select,
textarea {
  font-size: 0.9em !important;
}
.el-input,
.el-textarea,
.el-textarea__inner,
.el-input__inner {
  border-color: rgb(200, 200, 200) !important;
}
.el-form--label-top {
  padding: 0 !important;
}
/*

 Notifications


*/
.custom_notification_icon {
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  color: #909399;
  padding: 10px;
}
/*

 Mobile


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
