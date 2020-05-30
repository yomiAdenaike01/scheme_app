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
import { FadeTransition } from "vue2-transitions";

import SButton from "@/components/SButton";
import refactorLocation from "@/mixins/refactorLocation";

export default {
  name: "App",
  components: {
    SButton,
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
    ...mapState(["globalIntervals", "clientInformation"]),
    ...mapState(["team", "overlayIndex"]),
    ...mapGetters(["getIsIE"])
  },
  created() {
    if (this.getIsIE) {
      alert(
        "Your browser is Internet explorer, we do not support this browser and suggest movement towards a more modern browser i.e. Google chrome, we apologise for the inconvinience"
      );
    }
    this.CREATE_GLOBAL_INTERVAL({
      immediate: true,
      id: "client",
      method: async () => {
        try {
          this.identifyClient()
            .then(() => {
              return Promise.resolve();
            })
            .catch(() => {
              return Promise.reject();
            });
        } catch (error) {
          return Promise.reject(error);
        }
      },
      duration: this.globalIntervals.client
    });
  },

  beforeDestroy() {
    this.logOut();
  },

  methods: {
    ...mapActions(["request", "genPromptBox", "logOut"]),
    ...mapMutations([
      "DELETE_USER_SESSION",
      "CREATE_GLOBAL_INTERVAL",
      "DELETE_GLOBAL_INTERVAL",
      "UPDATE_CLIENT_INFORMATION",
      "CLEAR_NOTIFICATIONS"
    ]),
    destroyApplication() {
      this.DELETE_GLOBAL_INTERVAL("client");
      this.DELETE_GLOBAL_INTERVAL();
      this.DELETE_USER_SESSION();
    },
    async identifyClient() {
      try {
        let currentHostname = window.location.hostname.toString().split(".");
        let subdomain = currentHostname[0];

        let apiResponse = await this.request({
          method: "GET",
          url: "clients/get",
          params: { subdomain }
        });

        this.UPDATE_CLIENT_INFORMATION(apiResponse);
        this.loading = false;

        return Promise.resolve();
      } catch (error) {
        let { value } = await this.genPromptBox({
          boxType: "prompt",
          title: "No client found",
          text:
            "Please enter your client subdomain to go to your scheme cloud instance",
          type: "info"
        });

        this.refactorWindowLocation(value);
        this.destroyApplication();

        if (this.dialogShowing == false) {
          this.dialogShowing = true;
        }

        return Promise.reject(error);
      }
    }
  }
};
</script>
<style lang="scss">
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
.inner_cookies_container {
  padding: 20px;
  line-height: 1.7em;
}
.flat_input {
  &/deep/ .el-input__inner {
    padding: 15px;
    font-size: 1em;
    border: none;
    border-radius: 20px;
    background: rgb(249, 249, 249);
  }
}
.el-popover,
.el-popper {
  padding: 0px !important;
}
.popover_title {
  background: rgb(250, 250, 250);
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.popover_form /deep/ .form_wrapper .form {
  padding: 12px;
}
:root {
  // Primary
  --colour_primary: 74, 85, 100;
  --colour_grey: 250, 250, 250;
  --colour_secondary: 89, 212, 140;
  --colour_dark_grey: 210, 210, 210;

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
.large_icon {
  font-size: 9em;
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
.popover_item {
  padding: 10px;
  text-transform: capitalize;
  transition: $default_transition;
  cursor: pointer;
  &:hover {
    background: rgba(var(--colour_secondary), 0.06);
    color: rgba(var(--colour_secondary), 1);
  }
}

.s_input {
  border: none;
  background: transparent;
  padding: 10px;
  display: flex;
  flex: 1;
  border-radius: 6px;
  outline: none;
  width: 100%;
  border: 1px solid rgba(var(--colour_primary), 0.17);
  &:focus {
    border: 1px solid rgba(var(--colour_secondary), 0.6);
    caret-color: rgba(var(--colour_secondary), 0.6);
  }

  &.checkbox {
    width: initial;
    flex: initial;
  }

  &.no_border_radius {
    border-radius: 0px;
  }
  &.fill {
    background: rgb(249, 249, 249);
    border: none;
  }
  &.multiple {
    padding: 0;
  }
  &.no_border {
    border: none;
  }
  &.bold {
    font-weight: bold;
  }
}

/*

Fonts


*/
@import url("https://fonts.googleapis.com/css?family=Jost:300,400,500,600&display=swap");
.tab_content_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  max-height: calc(100% - 60px);
  overflow-x: hidden;
}

/*

 Default


*/
* {
  font-family: "Jost", sans-serif;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  outline: none;

  :before,
  :after {
    -webkit-font-smoothing: antialiased;
  }
}
.text_container {
  display: flex;
  flex-direction: column;
  flex: 1;

  .large_icon {
    font-size: 5em;
  }
  &.all_centre {
    justify-content: center;
    align-items: center;
    flex: 1;
  }
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
.json_display {
  white-space: pre;
}
#app {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}
h1,
h2,
h3,
h4,
h5 {
  margin: 0;
  padding: 0;
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
.avatar_container {
  display: flex;
  align-items: center;
  &.grouped {
    &/deep/ .avatar_wrapper {
      margin-left: -7px;
    }
  }
}
.grey {
  color: rgb(180, 180, 180);
}

.bold {
  font-weight: bold;
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
}
.trigger {
  cursor: pointer;
}
</style>
