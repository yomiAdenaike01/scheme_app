<template >
  <div class="flex message_container" :class="{['flex--end']:amISender}">
    <div
      :class="['message flex',{from_user:amISender}]"
      :style="{
        backgroundColor:amISender ? client.company_colours : 'blue'
        }"
    >
      <p>{{content}}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import ClientImage from "@/components/ClientImage";
export default {
  name: "ChatMessage",
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(["currentUser", "client"]),
    amISender() {
      return this.message.sender_id == this.currentUser._id;
    },
    content() {
      return this.message.content;
    },
    attachment() {
      return this.message.attachments;
    }
  }
};
</script>

<style lang="scss" scoped>
.message_container {
  width: 100%;
  justify-content: flex-start;
  color: white;
}
.message {
  background: #efefef;
  padding: 1em;
  &.from_user {
    border-top-right-radius: 10px;
  }
}
</style>