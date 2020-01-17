<template>
  <div class="no_chats_container p-3 flex_center">
    <el-input @input="$emit('searchContent',$event)" prefix-icon="el-icon-search" class="mr-3"></el-input>
    <Dropdown @method="switchMethod" placement="bottom-start" :icon="false" :items="items">
      <el-button icon="el-icon-more" type="primary" circle size="small"></el-button>
    </Dropdown>
  </div>
</template>

<script>
import Dropdown from "@/components/Dropdown";
import { mapMutations } from "vuex";
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
        },
        {
          name: `Delete chat`,
          icon: "el-icon-close",
          command: "removeChat"
        }
      ];
    }
  },
  methods: {
    ...mapMutations("Comms", ["UPDATE_START_NEW_CHAT"]),
    switchMethod(command) {
      if (command == "startNewChat") {
        this.UPDATE_START_NEW_CHAT(true);
      }
    }
  },
  components: {
    Dropdown
  }
};
</script>

<style lang="scss" scoped>
.no_chats_container {
  border-bottom: 1.5px solid #efefef;
}
</style>
