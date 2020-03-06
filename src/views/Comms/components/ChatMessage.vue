<template>
  <div class="flex message_container" :class="{ ['flex--end']: amISender }">
    <div
      :class="[
        'message mt-1 mr-3 ml-3 flex',
        { from_user: amISender },
        { not_user: !amISender }
      ]"
      :style="{
        backgroundColor: amISender ? client.company_colours : '#cccc'
      }"
    >
      <p>{{ content }}</p>
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
    ...mapState(["userInformation", "client"]),
    amISender() {
      return this.message.sender_id == this.userInformation._id;
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
  border-radius: 20px;

  &.from_user {
    border-bottom-right-radius: 1px;
  }
  &.not_user {
    border-bottom-left-radius: 1px;
  }
}
</style>
