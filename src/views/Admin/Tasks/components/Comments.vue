<template>
  <div class="comments_container">
    <div v-if="mode == 'overview'" class="overview_wrapper ">
      <i class="bx bx-message-rounded grey"></i>
      <small class="grey">{{ commentCount }}</small>
    </div>
    <div v-if="mode != 'overview'" class="comments_container">
      <div v-if="comments.length > 0">
        <div v-for="comment in commnets" :key="comment._id" class="comment">
          <div class="comment_header">
            <Avatar :name="comment.userName" />
            <small>{{ comment.userName }}</small>
            <small class="grey timestamp">{{
              initMoment(comment.dateCreated).calendar()
            }}</small>
          </div>

          <div
            class="comment_message"
            @mouseover="handleDisplayActions(comment.userID)"
            @click="editMessage = true"
          >
            <p v-if="(editMessage = false)">{{ comment.message }}</p>
            <el-input
              v-model="commentMessage"
              :placeholder="comment.message"
              @keyup.enter="updateMessage(comment.message)"
            />
          </div>
        </div>
      </div>
      <!-- Comment actions -->
      <div class="actions_wrapper" :class="{ visible: displayActions }">
        <!-- Delete comment -->
        <ActionIcon icon="trash" @click="$emit('deleteComment')" />
      </div>
      <div v-if="canInteract" class="empty_comment_wrapper">
        <Avatar class="comment_avatar" :name="userInformation.name" />
        <el-input
          v-model="commentMessage"
          placeholder="Write a comment..."
          @keyup.enter="$emit('createComment', commentMessage)"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "Comments",
  components: {
    ActionIcon: () => import("@/components/ActionIcon"),
    Avatar: () => import("@/components/Avatar")
  },
  props: {
    mode: {
      type: String,
      default: "overview"
    },
    comments: {
      type: Array,
      default: () => []
    },
    commentCount: {
      type: Number,
      default: 0
    },
    canInteract: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editMessage: false,
      commentMessage: "",
      displayActions: false
    };
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapState(["userInformation"])
  },
  methods: {
    handleDisplayActions(userID) {
      if (this.getIsAdmin || userID == this.userInformation._id) {
        this.displayActions = true;
      }
    },

    updateMessage(message) {
      if (
        message.toLowerCase().trim() != this.commentMessage.toLowerCase().trim()
      ) {
        this.$emit("updateComment", this.commentMessage);
        this.editMessage = false;
      } else {
        this.editMessage = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.overview_wrapper {
  display: flex;
  align-items: center;
  .bx {
    margin-right: 10px;
  }
}
.comment {
  display: flex;
  flex: 1;
  align-items: center;
}
.comment_header {
  display: flex;
  align-items: center;
  &/deep/ .avatar_container {
    margin-right: 10px;
  }
  .timestamp {
    color: rgb(230, 230, 230);
  }
}
.comment_message {
  padding: 10px;
}
.actions_wrapper {
  opacity: 0;
  will-change: opacity;
  transition: $default_transition opacity;
  &.visible {
    opacity: 1;
  }
}
.empty_comment_wrapper {
  display: flex;
  align-items: center;
}
.comment_avatar {
  margin-right: 10px;
}
</style>
