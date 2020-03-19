<template>
  <div class="comms_container" v-loading="loading">
    <CommsFilters />
    <CommsList />
    <CommsWindow />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import CommsList from "./components/CommsList";
import CommsWindow from "./components/CommsWindow";
import CommsEventBus from "./components/CommsEventBus";
import CommsFilters from "./components/CommsFilters";
export default {
  name: "CommsModule",
  data() {
    return {
      loading: false,
      commsInterval: null
    };
  },
  activated() {
    clearInterval(this.commsInterval);
    this.commsInterval = setInterval(() => {
      this.getTranscripts();
    }, this.requestsIntervals.transcripts);
    if (
      !this.hasEntries(this.activeTranscript) &&
      !this.hasEntries(this.$route.params) &&
      this.transcripts.length > 0
    ) {
      this.loading = true;
      this.getTranscripts()
        .then(response => {
          this.loading = false;
          if (response.length > 0) {
            this.UPDATE_ACTIVE_TRANSCRIPT(response?.[0]);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    }

    if (this.hasEntries(this.$route.params)) {
      let { id } = this.$route.params;
      // Find a transcript with the user of that user;
      let paramsTranscript = this.transcripts.find(transcript => {
        return (
          transcript.userTwo == id &&
          transcript.userOne == this.userInformation._id
        );
      });

      if (this.hasEntries(paramsTranscript)) {
        this.UPDATE_ACTIVE_TRANSCRIPT(paramsTranscript);
      } else {
        CommsEventBus.$emit("createNewChat", id);
      }
    }
  },
  components: {
    CommsList,
    CommsWindow,
    CommsFilters,
    CommsEventBus
  },
  computed: {
    ...mapState("Comms", ["activeTranscript", "transcripts"]),
    ...mapState(["userInformation"])
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts"]),
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"])
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
