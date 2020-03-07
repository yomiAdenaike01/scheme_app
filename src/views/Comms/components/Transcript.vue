<template>
  <div class="transcript_container">
    <Avatar :name="user.name" />
  </div>
</template>

<script>
import Avatar from "@/components/Avatar";
import { mapGetters } from "vuex";
export default {
  name: "Transcript",
  computed: {
    ...mapGetters("Admin", ["getUserInformation"]),
    user() {
      return this.getUserInformation("_id", data.userTwo);
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    Avatar
  }
};
</script>

<style></style>
