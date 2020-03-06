<template>
  <div
    class="noteitem_container"
    @click="note != undefined ? UPDATE_DISPLAY_NOTE(note) : null"
    :class="[{ emptyNote: note == undefined }]"
  >
    <div class="note_body" v-if="note == undefined">
      <el-button>Create new note</el-button>
    </div>

    <div v-else class="note_container">
      <!-- Notes header -->
      <div class="note_header p-3 flex_center">
        <Avatar :name="assignedTo.name" />
        <span class="grey">{{ assignedTo.groupID }}</span>
      </div>

      <!-- Notes body -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import moment from "moment";
import Avatar from "@/components/Avatar";
export default {
  name: "NoteItem",
  computed: {
    ...mapState("Admin", ["teamInformation", "groupIDs"]),

    isPrivate() {
      return this.note.public;
    },

    dateCreated() {
      return moment(this.note.dateCreated).format("dd/mm/yyyy");
    },

    haveAttachments() {
      return "attachments" in this.note;
    },

    returnAssignedTo() {
      let assignedTo;
      let teamMember = this.teamInformation.find(member => {
        return member._id == note.assignedTo;
      });

      if (teamMember) {
        assignedTo = teamMember;
        assignedTo.groupID = this.groupIDs[assignedTo.groupID - 1].name;
      } else {
        assignedTo = {
          name: "John Doe",
          groupID: this.groupIDs[1].name
        };
      }
      return assignedTo;
    }
  },
  methods: {
    ...mapMutations("Admin", ["UPDATE_DISPLAY_NOTE"])
  },
  props: {
    note: {
      type: Object | undefined
    }
  }
};
</script>

<style lang="scss" scoped>
.note_header {
  border-bottom: $border;
}
</style>
