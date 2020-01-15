<template>
  <el-row class="p-3" v-if="team.length < 0">
    <el-card>
      <Title title="No Team members." subtitle="To create a new employee navigate to schedule" />
    </el-card>
  </el-row>
</template>

<script>
import { mapState } from "vuex";
import Title from "@/components/Title";
export default {
  name: "NoTeamMembers",
  computed: {
    ...mapState("Admin", ["team"])
  },
  components: {
    Title
  }
};
</script>

<style>
</style>