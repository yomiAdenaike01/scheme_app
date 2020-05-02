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
  background: var(--colour_primary);
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
    color: var(--colour_primary);
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
span {
  text-transform: capitalize;
  margin-left: 15px;
}
.main_nav {
  height: 100%;
}
</style>
