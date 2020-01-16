<template>
  <div class="chat_window_container">
    <div v-for="message in messages" :key="message._id"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "ChatWindow",
  data() {
    return {
      messages: []
    };
  },
  methods: {
    ...mapActions(["request"])
  }
};
</script>

<style lang="scss" scoped>
.chat_window_container {
  height: 100%;
  width: 100%;
}
</style>