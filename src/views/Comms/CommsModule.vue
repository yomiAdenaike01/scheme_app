<template>
  <div class="comms_container">
    <Chats />
    <ActiveChat v-if="hasEntries(activeChat)" :router-user="$route" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "CommsModule",
  components: {
    Chats: () => import("./components/Chats"),
    ActiveChat: () => import("./components/ActiveChat")
  },
  computed: {
    ...mapState("Comms", ["activeChat"]),
    ...mapState(["requestIntervals"])
  },
  created() {
    this.CREATE_GLOBAL_INTERVAL({
      id: "commsCalls",
      immediate: true,
      method: () => {
        return new Promise((resolve, reject) => {
          this.getChats()
            .then(() => {
              resolve();
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      duration: this.requestIntervals.chat
    });
  },
  methods: {
    ...mapActions("Comms", ["getChats"]),
    ...mapMutations(["CREATE_GLOBAL_INTERVAL"])
  }
};
</script>

<style lang="scss" scoped>
.comms_container {
  background: white;
  display: flex;
  flex: 1;
  height: 100%;
}
</style>
