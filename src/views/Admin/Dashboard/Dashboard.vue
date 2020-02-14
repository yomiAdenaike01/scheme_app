<template>
  <div
    class="h-100 overflow"
    v-loading="loading"
    element-loading-background="rgba(255, 255, 255, 1)"
    :element-loading-text="
      `Optimising
    dashboard please wait....`
    "
  >
    <el-row class="h-100">
      <el-row :type="$mq == 'lg' ? 'flex' : null" class="h-100 pl-2">
        <Widgets />
        <UserSidebar />
      </el-row>
    </el-row>
  </div>
</template>

<script>
import Shifts from "./components/Shifts";
import UserSidebar from "./components/UserSidebar";
import Widgets from "./components/Widgets/Widgets";
import { mapActions, mapState } from "vuex";
export default {
  name: "Dashboard",
  data() {
    return {
      loading: true
    };
  },
  activated() {
    this.getTasks();
    this.getNotes();

    Promise.all([this.getTasks(), this.getNotes(), this.getTeam()])
      .then(response => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  },
  computed: {
    ...mapState(["userInformation"])
  },
  methods: {
    ...mapActions("Admin", ["getNotes", "getTasks", "getTeam"]),
    ...mapActions(["request"])
  },
  components: {
    UserSidebar,
    Shifts,
    Widgets
  }
};
</script>
