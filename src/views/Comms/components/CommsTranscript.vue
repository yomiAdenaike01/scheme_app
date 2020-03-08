<template>
  <div
    class="transcript_container flex flex--space-between align-center"
    v-loading="loading"
    @click="
      UPDATE_ACTIVE_TRANSCRIPT({
        ...data,
        userInfo: { ...user }
      })
    "
  >
    <div class="text_wrapper p-3 flex_center">
      <div v-if="hasEntries(user)">
        <Avatar class="mr-3" :name="user.name" />
      </div>
      <div>
        <p>
          {{ truncate(data.message.content, 50) }}
        </p>
        <p class="date grey">{{ initMoment(data.dateUpdated).calendar() }}</p>
        <transition name="el-fade-in">
          <small
            class="success"
            v-if="
              hasEntries(activeTranscript) && activeTranscript._id == data._id
            "
            >Active</small
          >
        </transition>
      </div>
    </div>
    <Popover trigger="hover" position="right">
      <i slot="trigger" class="bx bx-dots-vertical grey"></i>
      <div slot="content">
        <el-button size="small" @click="deleteTranscript">Delete </el-button>
        <el-button size="small">Mute </el-button>
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
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Comms", ["activeTranscript"]),
    ...mapGetters("Admin", ["getUserInformation"]),
    user() {
      return this.getUserInformation(this.data.userTwo);
    }
  },

  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"]),
    ...mapActions(["request"]),

    deleteTranscript() {
      this.loading = true;
      this.request({
        method: "DELETE",
        data: { id: this.data.transcriptID }
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },

  components: {
    Avatar,
    Popover
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
