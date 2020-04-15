<template>
  <div
    id="app"
    v-loading="loading"
    :class="{ mobile: $mq != 'lg' }"
    element-loading-text="Loading client instance please wait...."
  >
    <transition name="el-fade-in" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
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
      loading: true
    };
  },
  computed: {
    ...mapState([
      "requestIntervals",
      "notifications",
      "defaultSize",
      "clientInformation"
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
            .catch(() => {
              this.loading = false;
              this.genPromptBox({
                boxType: "prompt",
                title: "No client found",
                text:
                  "Please enter your client subdomain to go to your scheme cloud instance",
                type: "info"
              }).then(({ value }) => {
                this.refactorWindowLocation(value);
              });
              reject();
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
/*

 Element UI Configuration


*/
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
  border-radius: 10px !important;
  border-color: rgb(240, 240, 240) !important;
}
.el-textarea__inner {
  padding: 10px !important;
  min-height: 100px !important;
}
.el-textarea__inner:focus,
.el-textarea__inner:hover,
.el-input__inner:focus,
.el-input__inner:hover {
  border-color: rgb(200, 200, 200) !important;
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
