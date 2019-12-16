<template>
  <div
    class="previous_chat"
    @click="$emit('chatData',{id:transcriptData._id,reciever:transcriptData.user_2})"
  >
    <div class="grid p-2">
      <el-avatar class="mr-4" icon="el-icon-user-solid"></el-avatar>
      <div class="grid_content">
        <span>{{transcriptData.message.content}}</span>
        <br />
        <span class="grey">{{calendar(transcriptData.updated_at)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import dates from "@/mixins/dates";
export default {
  name: "PreviousChat",
  props: {
    transcriptData: Object
  },
  mixins: [dates]
};
</script>

<style lang="scss" scoped>
.previous_chat {
  cursor: pointer;
  border-bottom: 1px solid #e6e6e6;
  &:hover {
    background: whitesmoke;
  }
}
.grid {
  display: flex;
}
.grey {
  font-size: 0.8em;
}
</style>