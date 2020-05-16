<template>
  <nav :class="{ flex: mode == 'tabs', nav_sidebar: mode == 'main' }">
    <ul v-if="mode == 'main'">
      <router-link
        v-for="route in routes"
        :key="route.path"
        :to="route.name"
        tag="li"
        :index="route.path"
      >
        <i :class="route.icon" class="home_icon"></i>
      </router-link>
    </ul>
    <slide-y-down-transition mode="out-in">
      <div
        v-show="mode == 'contextmenu' && displayMenu"
        ref="context_menu"
        v-click-outside="closeContextMenu"
        class="contextmenu_container"
      >
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          :style="item.style"
          class="contextmenu_item"
          @click="triggerItemAction(item)"
        >
          <span v-html="item.label"></span>
        </div>
      </div>
    </slide-y-down-transition>
    <div v-if="mode == 'tabs'" class="tabs_container">
      <div
        v-for="(tab, index) in tabItems"
        :key="index"
        class="tab"
        :class="{
          active: activeTab == tab && Object.values(activeStyle).length == 0
        }"
        :style="
          activeTab == tab && Object.values(activeStyle).length > 0
            ? activeStyle
            : Object.values(customStyle).length > 0
            ? customStyle
            : {}
        "
        @click="$emit('changeTab', makeUgly(tab))"
      >
        <p>{{ makePretty(tab) }}</p>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import vClickOutside from "v-click-outside";
import { SlideYDownTransition } from "vue2-transitions";
export default {
  name: "Menu",
  components: {
    SlideYDownTransition
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  props: {
    mode: {
      type: String,
      default: "main",
      validator(type) {
        return ["main", "contextmenu", "tabs"].indexOf(type) > -1;
      }
    },
    menuItems: {
      type: Array,
      default: () => []
    },
    tabItems: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: String,
      default: ""
    },
    activeStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    customStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    displayMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapse: true
    };
  },
  computed: {
    ...mapState(["clientInformation", "localSettings"]),
    ...mapGetters(["getDefaultColour", "adminPermission"]),

    routes() {
      let allowedRoutes = [
        {
          name: "events",
          icon: "bx bxs-dashboard"
        },
        {
          name: "tasks",
          icon: "bx bx-task"
        },
        {
          name: "comms",
          icon: "bx bxl-discourse"
        }
      ];
      if (this.adminPermission) {
        allowedRoutes.push({
          name: "team",
          icon: "bx bx-group"
        });
      }
      return allowedRoutes;
    }
  },
  beforeDestroy() {
    if (this.mode == "contextmenu") {
      window.removeEventListener("contextmenu", this.onContextMenu);
    }
  },

  mounted() {
    if (this.mode == "contextmenu") {
      window.addEventListener("contextmenu", this.onContextMenu);
    }
  },

  methods: {
    triggerItemAction(item) {
      item.action();
      this.closeContextMenu();
    },
    closeContextMenu() {
      if (this.mode == "contextmenu") {
        this.$emit("close");
      }
    },
    onContextMenu(e) {
      e.preventDefault();
      this.$emit("srcElement", e.srcElement);
      let { context_menu } = this.$refs;

      context_menu.style.left = `${e.pageX}px`;
      context_menu.style.top = `${e.pageY}px`;
    }
  }
};
</script>

<style lang="scss" scoped>
.nav_sidebar {
  background: rgba(var(--colour_primary), 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
  padding: 0 0 0 10px;
  border-top-right-radius: 40px;
  position: relative;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
}

.nav_sidebar ul li {
  display: flex;
  align-items: center;
  width: 100%;
  flex: 1;
  color: white;
  padding: 10px 20px;
  transition: $default_transition;
  will-change: background;
  position: relative;
  margin: 25px 0;
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;

  &.router-link-active {
    background: white;
    color: rgba(var(--colour_primary), 1);
  }
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  i {
    border-radius: 30%;
    transition: $default_transition;
  }
}
.home_icon {
  font-size: 1.3em;
}

.main_nav {
  height: 100%;
}

.contextmenu_container {
  position: fixed;
  background: white;
  box-shadow: 0px 10px 20px 1px rgb(200, 200, 200);
  padding: 10px;
  z-index: 99999;
  border-radius: 10px;

  &:after {
    position: absolute;
    top: -35%;
    content: "";
    left: 0.9%;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
    border-top: 15px solid transparent;
    border-bottom: 15px solid white;
  }
}
.contextmenu_item {
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: $default_transition;
  &:hover {
    transform: translateX(2px);
  }
}
.tabs_container {
  display: flex;
  flex: 1;
  justify-content: space-between;
  border-bottom: $border;
  background: rgb(250, 250, 250);
}
.tab {
  cursor: pointer;
  flex: 1;
  text-align: center;
  padding: 0px 15px;
  text-transform: capitalize;
  border-right: 1px solid rgb(230, 230, 230);
  position: relative;
  transition: $default_transition;
  &.active {
    &::after {
      position: absolute;
      top: 0;
      height: 2px;
      left: 0;
      right: 0;
      content: "";
      background: rgba(var(--colour_secondary), 1);
    }
    background: rgba(var(--success), 0.1);
  }
  &:hover {
    background: rgba(var(--colour_secondary), 0.1);
  }
}
</style>
