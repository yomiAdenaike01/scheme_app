<template>
  <el-row>
    <el-col>
      <span
        :class="['message mt-3 p-3',{user:message.sender_id == currentUser._id}]"
      >{{message.content}}</span>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Message",
  props: {
    message: Object
  },
  computed: {
    ...mapState(["currentUser"])
  }
};
</script>

<style lang="scss" scoped>
.message {
  border-radius: 5px;
  display: flex;
  color: white;
  background: rgb(220, 220, 220);
  justify-content: flex-start;
}
.user {
  background: #67c23a;
  justify-content: flex-end;
}
</style>