<template>
  <div class="message mt-3" :class="classes">
    <span class="p-3" :class="classes">{{message.content}}</span>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Message",
  props: {
    message: Object
  },
  computed: {
    ...mapState(["currentUser"]),
    classes() {
      const message = this.message;
      const currentUser = this.currentUser;
      if (message.sender_id == currentUser._id) {
        return "user";
      } else {
        return "other";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.message {
  color: white;
  display: flex;
}
.user {
  background: #2f74eb;
  border-radius: 5px;
  justify-content: flex-end;
}
.other {
  border-radius: 5px;
  background: rgb(220, 220, 220);
}
</style>