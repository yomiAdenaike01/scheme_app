<template>
  <el-dialog :visible.sync="viewController">{{noteData}}</el-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "NotesDisplay",
  computed: {
    ...mapState("Admin", ["viewNote"]),

    noteData() {
      let viewNote = { ...this.viewNote };
      delete viewNote.display;
      return viewNote;
    },
    viewController: {
      get() {
        return this.viewNote.display;
      },
      set() {
        this.UPDATE_DISPLAY_NOTE(val);
      }
    }
  }
};
</script>

<style>
</style>