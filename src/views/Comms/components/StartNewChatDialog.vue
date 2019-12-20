<template>
  <el-dialog :visible.sync="displayModal" title="Start New Chat">
    <Title title="Select a team member" subtitle="That you want to start a new chat wiith" />
    <el-table :data="team">
      <el-table-column prop="name">
        <template slot-scope="scope">
          <div
            class="select_user_2"
            @click="$emit('newUser',scope.row._id),displayModal='false',$emit('toggle',false)"
          >
            <p>{{scope.row.name}}</p>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import Title from "@/components/Title";
import ScheduleTable from "@/views/Admin/components/ScheduleTable";
import { mapState } from "vuex";
export default {
  name: "StartNewChatDialog",
  computed: {
    ...mapState(["team", "transcripts"]),

    displayModal: {
      get() {
        return this.display;
      },
      set(display) {
        this.$emit("toggle", display);
      }
    },

    filteredTeam() {
      const len = transcripts.length;
      let filterTeam = [...this.team];
      for (let i = 0; i < len; i++) {
        const transcript = transcripts[i];
        const user2 = transcript.user_2;
        const index = team.findIndex(member => {
          return member.id == user2;
        });
        if (index >= 0) {
          filterTeam.splice(index, 1);
        }
      }
      return filterTeam;
    }
  },
  components: {
    Title,
    ScheduleTable
  },
  props: {
    display: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.select_user_2 {
  text-transform: capitalize;
  cursor: pointer;
}
</style>