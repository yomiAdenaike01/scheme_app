<template>
  <div class="chat_window_container">{{messages}}</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "ChatWindow",
  props: {
    messages: Array | Object
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