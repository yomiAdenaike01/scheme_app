<template>
  <div
    class="transcript_container flex flex--space-between align-center"
    :class="{
      active: hasEntries(activeTranscript) && activeTranscript._id == data._id
    }"
    v-loading="loading || loadingTranscript"
    @click="
      UPDATE_ACTIVE_TRANSCRIPT({
        ...data,
        userInfo: { ...user }
      })
    "
  >
    <div class="text_wrapper p-3 flex_center posr">
      <div v-if="hasEntries(user)">
        <Avatar class="mr-3" :name="user.name" />
      </div>
      <div>
        <p>
          {{ truncate(data.message.content, 50) }}
        </p>
        <p class="date grey">{{ initMoment(data.dateUpdated).calendar() }}</p>
      </div>
    </div>
    <Popover trigger="hover" position="right">
      <i slot="trigger" class="bx bx-dots-vertical grey"></i>
      <div slot="content">
        <el-button size="small" @click="deleteTranscript">Delete </el-button>
        <el-button size="small" @click="muteController"
          >{{ isMuted ? "Unmute" : "Mute" }}
        </el-button>
      </div>
    </Popover>
  </div>
</template>

<script>
import Avatar from "@/components/Avatar";
import Popover from "@/components/Popover";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "CommsTranscript",
  data() {
    return {
      loading: false
    };
  },
  props: {
    loadingTranscript: {
      type: Boolean,
      deafault: false
    },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    Avatar,
    Popover
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Comms", ["activeTranscript"]),
    ...mapGetters("Admin", ["getUserInformation"]),
    user() {
      return this.getUserInformation(this.data.userTwo);
    },
    isMuted() {
      return this.data.mutedNotifications.indexOf(this.userInformation) > -1;
    }
  },
  methods: {
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"]),
    ...mapActions(["request"]),
    muteController() {
      let mutedNotifications = [...this.activetTranscript.mutedNotifications];
      let data;
      if (!this.isMuted) {
        data = {
          update: {
            mutedNotifications: [
              ...mutedNotifications,
              this.userInformation._id
            ]
          }
        };
      } else {
        mutedNotifications.splice(
          mutedNotifications.indexOf(this.userInformation._id),
          1
        );
        data = {
          update: {
            mutedNotifications: [...mutedNotifications]
          }
        };
      }
      this.request({
        method: "POST",
        url: "messenger/update",
        data
      });
    },
    deleteTranscript() {
      this.loading = true;
      this.request({
        url: "messengers/transcripts",
        method: "DELETE",
        data: { _id: this.data.transcriptID }
      })
        .then(() => {
          this.loading = false;
          this.UPDATE_ACTIVE_TRANSCRIPT();
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.transcript_container {
  flex: 1;
  border-top: $border;
  border-bottom: $border;
  transition: 0.5s ease background;
  cursor: pointer;
  &:hover {
    background: rgb(252, 252, 252);
  }
  &.active {
    background: rgb(245, 245, 245);
  }
}
.text_wrapper {
  line-height: 1.4em;
}
.active_transcript_badge {
  font-size: 1.5em;
}
.success {
  color: rgb(160, 160, 160);
  text-transform: capitalize;
}
small {
  font-size: 0.7em;
}
.date {
  font-size: 0.8em;
}
</style>
