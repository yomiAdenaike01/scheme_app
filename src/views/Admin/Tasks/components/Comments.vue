<template>
  <div class="comments_container">
    <div v-if="mode == 'overview'" class="overview_wrapper ">
      <i class="bx bx-message-rounded grey"></i>
      <small class="grey">{{ commentCount }}</small>
    </div>
    <div v-if="mode != 'overview'" class="comments_container">
      <div v-if="comments.length > 0">
        <div
          v-for="(comment, index) in comments"
          :key="comment._id"
          class="comment"
        >
          <div class="comment_header">
            <Avatar :name="comment.assignedTo.name" />
            <small class="username">{{ comment.assignedTo.name }}</small>
            <small class="timestamp">{{ new Date(comment.dateCreated) }}</small>
          </div>

          <div
            class="comment_message"
            @mouseover="handleDisplayActions(comment.userID)"
            @click="editMessage = true"
          >
            <p v-if="editMessage == false">{{ comment.message }}</p>
            <div v-else class="update_comment_container">
              <el-input
                v-model="commentMessage"
                :placeholder="comment.message"
                @keyup.enter="comment.message, comment._id"
              />
              <el-button
                type="text"
                @click="
                  $emit('updateComment', {
                    commentIndex: index,
                    message: commentMessage,
                    _id: comment._id
                  })
                "
                >Post</el-button
              >
            </div>
          </div>
        </div>
      </div>

      <div v-if="canInteract" class="empty_comment_wrapper">
        <Avatar class="comment_avatar" :name="userInformation.name" />
        <el-input
          v-model="newMessage"
          placeholder="Write a comment..."
          @keyup.enter="$emit('createComment', newMessage), reset()"
        ></el-input>
        <el-button
          type="text"
          :disabled="newMessage.length == 0"
          @click="$emit('createComment', newMessage), reset()"
          >Post</el-button
        >
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
      newMessage: "",
      displayActions: false
    };
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapState(["userInformation"])
  },
  methods: {
    reset() {
      this.newMessage = "";
      this.commentMessage = "";
      this.editMessage = false;
    },
    handleDisplayActions(userID) {
      if (this.getIsAdmin || userID == this.userInformation._id) {
        this.displayActions = true;
      }
    },

    updateMessage(message, _id) {
      if (
        message.toLowerCase().trim() != this.commentMessage.toLowerCase().trim()
      ) {
        this.$emit("updateComment", { comment: this.commentMessage, _id });
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
  flex-direction: column;
  background: rgb(250, 250, 250);
  margin-bottom: 10px;
  max-height: fit-content;
  border-radius: 10px;
  .el-input {
    margin-right: 10px;
  }
}
.update_comment_container {
  display: flex;
  align-items: center;
  flex: 1;
}
.comment_header {
  display: flex;
  align-items: center;
  &/deep/ .avatar_container {
    margin-right: 10px;
  }
  .timestamp {
    color: rgb(200, 200, 200);
    margin-left: 10px;
  }
  .username {
    margin-left: 5px;
    text-transform: capitalize;
  }
}
.comment_message {
  padding: 10px;
}

.empty_comment_wrapper {
  display: flex;
  align-items: center;
  padding: 20px;
}
.comment_avatar {
  margin-right: 10px;
}
</style>
