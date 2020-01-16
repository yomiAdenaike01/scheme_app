<template>
  <div class="no_chats_container p-3 flex_center">
    <el-input @input="$emit('searchContent',$event)" prefix-icon="el-icon-search" class="mr-3"></el-input>
    <Dropdown @method="switchMethod" placement="bottom-start" :icon="false" :items="items">
      <el-button icon="el-icon-more" type="primary" circle size="small"></el-button>
    </Dropdown>
    <NewChatDialog :view="newChatDialog" @toggle="newChatDialog = $event" />
  </div>
</template>

<script>
import NewChatDialog from "./NewChatDialog";
import Dropdown from "@/components/Dropdown";
export default {
  name: "ChatListHeader",
  data() {
    return {
      newChatDialog: false
    };
  },
  computed: {
    items() {
      return [
        {
          name: `Start new chat`,
          icon: "el-icon-plus",
          command: "startNewChat"
        }
      ];
    }
  },
  methods: {
    switchMethod(command) {
      if (command == "startNewChat") {
        this.newChatDialog = true;
      }
    }
  },
  components: {
    NewChatDialog,
    Dropdown
  }
};
</script>

<style lang="scss" scoped>
.no_chats_container {
  border-bottom: 1.5px solid #efefef;
}
</style>
