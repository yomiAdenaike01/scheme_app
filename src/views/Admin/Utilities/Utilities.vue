<template>
  <div class="h-100">
    <el-row type="flex" class="utilities_container h-100">
      <Tasks />
      <Notes />
      <NotesDisplay />
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Tasks from "./Tasks/Tasks";
import Notes from "./Notes/Notes";
import NotesDisplay from "./Notes/components/NotesDisplay";
export default {
  name: "Utilities",
  activated() {
  //  this.getTasks();

      this.getNotes();
    
  },

  methods: {
    ...mapActions("Admin", ["getNotes", "getTasks"])
  },
  components: {
    Notes,
    Tasks,
    NotesDisplay
  }
};
</script>
