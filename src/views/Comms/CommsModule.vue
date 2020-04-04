<template>
  <div class="comms_container">
    <Chats />
    <ActiveChat />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  name: "CommsModule",
  components: {
    Chats: () => import("./components/Chats"),
    ActiveChat: () => import("./components/ActiveChat")
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
            .catch(() => {
              reject();
            });
        });
      },
      duration: 40000
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
  display: flex;
  flex: 1;
  height: 100%;
}
</style>
