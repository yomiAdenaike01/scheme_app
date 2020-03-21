<template>
  <div class="comms_container" v-loading="loading">
    <CommsList />
    <CommsWindow />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import CommsList from "./components/CommsList";
import CommsWindow from "./components/CommsWindow";
import CommsEventBus from "./components/CommsEventBus";

export default {
  name: "CommsModule",
  data() {
    return {
      loading: false,
      commsInterval: null
    };
  },
  activated() {
    this.loading = true;
       this.getTranscripts()
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });

    clearInterval(this.commsInterval);
    this.commsInterval = setInterval(() => {
      this.getTranscripts()
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }, this.requestIntervals.transcripts);
    if (
      !this.hasEntries(this.activeTranscript) &&
      !this.hasEntries(this.$route.params)
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
    // Setting transcript to the one found in the router
    this.setTranscriptFromRoute();
  },
  deactivated(){
    clearInterval(this.commsInterval)
  },
  components: {
    CommsList,
    CommsWindow,
    CommsEventBus
  },
  computed: {
    ...mapState("Comms", ["activeTranscript", "transcripts"]),
    ...mapState(["userInformation", "requestIntervals"])
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts"]),
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"]),

    setTranscriptFromRoute() {
      if (this.hasEntries(this.$route.params)) {
        let id = this.$route.params?.id;
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
    }
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
