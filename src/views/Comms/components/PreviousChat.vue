<template>
  <div
    :class="[
      'previous_chat_container flex align-center flex--space-between',
      { selected: activeTranscript._id == id }
    ]"
    @click="UPDATE_ACTIVE_TRANSCRIPT(data)"
  >
    <div class="flex align-center">
      <!-- Select chat to delete indicator -->
      <el-checkbox
        v-if="selectionState"
        v-model="deleteChatIndicator"
        size="medium"
        class="mr-4"
      />
      <Avatar class="mr-3" :name="participant.name" />
      <div class="flex columns">
        <p>{{ content }}</p>
        <p class="time">{{ updatedAt }}</p>
      </div>
    </div>
    <!-- Indicator for selected chat -->
    <transition name="el-fade-in">
      <div
        v-if="activeTranscript._id == id"
        class="selected_indicator"
        :style="{ backgroundColor: client.company_colours }"
      ></div>
    </transition>
  </div>
</template>

<script>
import moment from "moment";
import Avatar from "@/components/Avatar";
import findTeam from "@/mixins/findTeam";

import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "PreviousChat",
  data() {
    return {
      deleteChatIndicator: ""
    };
  },
  mixins: [findTeam],
  props: {
    data: {
      type: Object
    },
    selectionState: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("Admin", ["teamInformation"]),
    ...mapState("Comms", ["activeTranscript", "selectedChat"]),
    ...mapState(["clientInformation"]),
    ...mapGetters(["getSidebarColour"]),
    participant() {
      return this.findTeamMember(this.data.user_2)
        ? this.findTeamMember(this.data.user_2)
        : "John Doe";
    },
    updatedAt() {
      return moment().calendar(this.data.updated_at);
    },
    firstMessage() {
      return this.data.message;
    },
    content() {
      return this.firstMessage.content;
    },
    id() {
      return this.data._id;
    },
    isSelectedToRemove() {
      let selectedChat = this.selectedChat;
      return selectedChat == this.id;
    }
  },
  methods: {
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"])
  },
  components: {
    Avatar
  },
  watch: {
    deleteChatIndicator(val) {
      if (val) {
        this.$emit("selectedChat", this.id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.previous_chat_container {
  flex: 1;
  line-height: 1.5em;
  min-height: 100px;
  cursor: pointer;
  border-bottom: 1.5px solid #efefef;
  transition: 0.15s linear all;
  padding-left: 10px;
  &:hover {
    background: darken($color: #fff, $amount: 2);
  }
  &.selected {
    box-shadow: $box_shadow;
  }
}
.time {
  color: rgb(172, 172, 172);
  font-size: 0.9em;
}
.selected_indicator {
  width: 10px;
  height: 100%;
  min-height: 100px;
}
</style>
