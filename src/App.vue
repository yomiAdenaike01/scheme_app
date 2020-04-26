<template>
  <div
    id="app"
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
import refactorLocation from "@/mixins/refactorLocation";
export default {
  name: "App",
  mixins: [refactorLocation],
  data() {
    return {
      loading: true,
      dialogShowing: false
    };
  },
  computed: {
    ...mapState([
      "requestIntervals",
      "notifications",
      "defaultSize",
      "clientInformation"
    ]),
    ...mapState("Admin", ["team"]),
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
              this.REMOVE_USER();
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
    this.CLEAR_GLOBAL_INTERVAL();
    this.REMOVE_USER();
  },

  methods: {
    ...mapActions(["request", "genPromptBox"]),
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
  --color-h-primary: 213;
  --color-s-primary: 15%;
  --color-l-primary: 34%;

  // Secondary
  --color-h-secondary: 145;
  --color-s-secondary: 59%;
  --color-l-secondary: 59%;

  // Tertiary
  --color-h-tertiary: 0;
  --color-s-tertiary: 100%;
  --color-l-tertiary: 65%;

  // Grey 1
  --color-h-gdark: 210;
  --color-s-gdark: 18%;
  --color-l-gdark: 83%;

  // Grey 2
  --color-h-glight: 213;
  --color-s-glight: 18%;
  --color-l-glight: 88%;

  --colour_grey: hsl(
    var(--color-h-gdark),
    var(--color-s-gdark),
    var(--color-l-gdark)
  );

  --colour_grey_light: hsl(0, 0%, 98%);

  // Primary colour (blue)

  --colour_primary: hsl(
    var(--color-h-primary),
    var(--color-s-primary),
    var(--color-l-primary)
  );

  --colour_darker_primary: hsl(
    var(--color-h-primary),
    var(--color-s-primary),
    56%
  );
  --colour_dark_primary: hsl(
    var(--color-h-primary),
    var(--color-s-primary),
    40%
  );

  --colour_lighter_primary: hsl(
    var(--color-h-primary),
    var(--color-s-primary),
    55%
  );
  --colour_even_lighter_primary: hsl(
    var(--color-h-primary),
    var(--color-s-primary),
    80%
  );
  // Secondary colour

  --colour_secondary: hsl(
    var(--color-h-secondary),
    var(--color-s-secondary),
    var(--color-l-secondary)
  );
  --colour_secondary_lighter: hsl(
    var(--color-h-secondary),
    var(--color-s-secondary),
    75%
  );
  --colour_secondary_darker: hsl(
    var(--color-h-secondary),
    var(--color-s-secondary),
    50%
  );

  // tertiary colour (green)
  --colour_tertiary: hsl(
    var(--color-h-tertiary),
    var(--color-s-tertiary),
    var(--color-l-tertiary)
  );
  --colour_tertiary_darker: hsl(
    var(--color-h-tertiary),
    var(--color-s-tertiary),
    70%
  );

  --colour_tertiary_lighter: hsl(
    var(--color-h-tertiary),
    var(--color-s-tertiary),
    87%
  );
}

/*

Fonts


*/
@import url("https://fonts.googleapis.com/css?family=Lato:300,400&display=swap");
/*

 Default


*/
* {
  font-family: "Lato", Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;

  :before,
  :after {
    -webkit-font-smoothing: antialiased;
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
.el-popover .el-popper {
  max-width: fit-content;
  min-width: fit-content;
}
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
