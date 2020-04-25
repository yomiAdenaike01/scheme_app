<template>
  <nav class="nav_sidebar">
    <ul>
      <router-link
        v-for="route in routes"
        :key="route.path"
        :to="route.name"
        tag="li"
        :index="route.path"
      >
        <i :class="route.icon" class="home_icon"></i>
        <span>{{ route.name }}</span>
      </router-link>
    </ul>
  </nav>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "Navigation",
  data() {
    return {
      isCollapse: true
    };
  },
  computed: {
    ...mapState(["clientInformation", "localSettings"]),
    ...mapGetters(["getDefaultColour", "getIsAdmin"]),

    routes() {
      let allowedRoutes = [
        {
          name: "events",
          path: "/admin/events",
          icon: "el-icon-date"
        },
        {
          name: "tasks",
          icon: "bx bx-task"
        },
        {
          name: "comms",
          icon: "bx bx-message"
        }
      ];
      if (this.getIsAdmin) {
        allowedRoutes.push({
          name: "user",
          icon: "bx bx-group"
        });
      }
      return allowedRoutes;
    }
  }
};
</script>

<style lang="scss" scoped>
.nav_sidebar {
  padding-top: 30px;
  background: var(--colour_primary);
  display: flex;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
  border-top-right-radius: 40px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
}

.nav_sidebar ul li {
  &:first-of-type {
    border-top-right-radius: 40px;

    &:hover {
      background: var(--colour_lighter_primary);
      border-top-right-radius: 40px;
    }
  }
  position: relative;
  &.router-link-active {
    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 20%;
      bottom: 0px;
      width: 2px;
      border-bottom-right-radius: 50px;
      border-top-left-radius: 50px;
      background: white;
    }
    i {
      background: white;
      color: var(--colour_primary);
    }
  }
  display: flex;
  align-items: center;
  width: 100%;
  flex: 1;
  color: white;
  padding: 20px;
  transition: $default_transition background;
  will-change: background;
  &:hover {
    background: var(--colour_lighter_primary);
    cursor: pointer;
    i {
      background: white;
      color: var(--colour_primary);
    }
  }
  i {
    background: var(--colour_darker_primary);
    padding: 20px;
    border-radius: 30%;
    transition: $default_transition;
  }
}
.home_icon {
  font-size: 1.2em;
}
span {
  text-transform: capitalize;
  margin-left: 15px;
}
.main_nav {
  height: 100%;
}
</style>
