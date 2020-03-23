<template>
  <div
    class="transcript_container flex flex--space-between align-center"
    :class="{
      active: hasEntries(activeTranscript) && activeTranscript._id == data._id
    }"
    @click="updateComms"
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
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";

import CommsEventBus from "./CommsEventBus";

import Avatar from "@/components/Avatar";
import Popover from "@/components/Popover";
export default {
  name: "CommsTranscript",
  components: {
    Avatar,
    Popover
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false
    };
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
    ...mapMutations("Comms", [
      "UPDATE_ACTIVE_TRANSCRIPT",
      "UPDATE_TRANSCRIPT_LOADING"
    ]),
    ...mapActions(["request"]),
    ...mapActions("Comms", ["getMessages"]),
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
    },
    updateTranscript() {
      return new Promise((resolve, reject) => {
        try {
          this.UPDATE_ACTIVE_TRANSCRIPT({
            ...this.data,
            userInfo: { ...this.user }
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateComms() {
      this.UPDATE_TRANSCRIPT_LOADING(true);
      Promise.all([this.getMessages(), this.updateTranscript()])
        .then(() => {
          this.UPDATE_TRANSCRIPT_LOADING(false);
        })
        .catch(err => {
          this.UPDATE_TRANSCRIPT_LOADING(false);
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
