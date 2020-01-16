<template>
  <el-dialog :visible.sync="toggleView">
    <div v-if="team.length > 0">
      <div :key="member._id" v-for="member in team"></div>
    </div>
    <div v-else>
      <h3>No team members</h3>
    </div>
  </el-dialog>
</template>

<script>
import Title from "@/components/Title";
import { mapState } from "vuex";
export default {
  name: "NewChatDialog",
  props: {
    view: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("Admin", ["team"]),
    toggleView: {
      get() {
        return this.view;
      },
      set(val) {
        this.$emit("toggle", val);
      }
    }
  },
  components: {
    Title
  }
};
</script>

<style></style>
