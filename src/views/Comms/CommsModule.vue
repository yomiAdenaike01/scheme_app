<template>
  <div class="comms_container">
    <Transcripts />
    <CurrentChat />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  name: "CommsModule",
  components: {
    Transcripts: () => import("./components/Transcripts"),
    CurrentChat: () => import("./components/CurrentChat")
  },
  created() {
    this.CREATE_GLOBAL_INTERVAL({
      id: "commsCalls",
      immediate: true,
      method: () => {
        return new Promise((resolve, reject) => {
          this.getTranscripts()
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
    ...mapActions("Comms", ["getTranscripts"]),
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
