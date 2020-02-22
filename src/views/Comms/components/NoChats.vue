<template>
  <div class="error_display flex_center columns">
    <LeadIcon icon="el-icon-chat-round" class="large_icon" />
    <div class="text_container mt-3 mb-3">
      <h3>No previous chats found</h3>
      <span class="grey desc">Press the button below to start a new chat</span>
    </div>
    <el-button icon="el-icon-plus" circle @click="UPDATE_START_NEW_CHAT(true)"></el-button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import LeadIcon from "@/components/LeadIcon";
export default {
  name: "NoChats",

  methods: {
    ...mapMutations("Comms", ["UPDATE_START_NEW_CHAT"])
  },
  components: {
    LeadIcon
  }
};
</script>

<style lang="scss" scoped>
.error_display {
  height: 100%;
}
.no_chat_indiciator {
  margin-top: -1em;
  font-size: 2.5em;
}
</style>