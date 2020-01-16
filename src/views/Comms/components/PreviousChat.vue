<template>
  <div
    class="previous_chat_container flex align-center flex--space-between p-4"
    @click="UPDATE_ACTIVE_TRANSCRIPT(data)"
  >
    <div class="flex align-center">
      <Avatar class="mr-3" :name="!participant ? 'John Doe' : participant" />
      <div class="flex columns">
        <p>{{content}}</p>
        <p class="time">{{updatedAt}}</p>
      </div>
    </div>
    <transition name="el-fade-in">
      <i class="el-icon-view" :style="{color:getSidebarColour}" v-if="activeTranscript._id == id"></i>
    </transition>
  </div>
</template>

<script>
import moment from "moment";
import Avatar from "@/components/Avatar";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "PreviousChat",
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    ...mapState("Admin", ["team"]),
    ...mapState("Comms", ["activeTranscript"]),
    ...mapGetters(["getSidebarColour"]),

    participant() {
      let foundUser = this.team.find(member => {
        return member._id == this.data.user_2;
      });
      if (!foundUser) {
        foundUser = "";
      } else {
        foundUser = foundUser.name;
      }
      return foundUser;
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
    }
  },
  methods: {
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"])
  },
  components: {
    Avatar
  }
};
</script>

<style lang="scss" scoped>
.previous_chat_container {
  flex: 1;
  line-height: 1.5em;
  cursor: pointer;
  border-bottom: 1.5px solid #efefef;
  transition: 0.15s linear all;
  &:hover {
    background: darken($color: #fff, $amount: 2);
  }
}
.time {
  color: rgb(172, 172, 172);
  font-size: 0.9em;
}
</style>