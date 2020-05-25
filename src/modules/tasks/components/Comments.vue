<template>
  <div class="comments">
    <h3 class="comments_title grey">Comments ({{ comments.length }})</h3>
    <div
      v-if="comments.length > 0"
      ref="comments_wrapper"
      class="comments_wrapper"
    >
      <div
        v-for="(comment, index) in comments"
        :key="`${comment._id}${index}`"
        class="comment"
      >
        <div class="comment_header">
          <Avatar :name="comment.assigned_to.name" />
          <small class="username">{{ comment.assigned_to.name }}</small>
          <small class="timestamp">{{
            initMoment(comment.date_created).calendar()
          }}</small>
        </div>

        <div class="comment_message" @click="editMessage = true">
          <p>{{ comment.message }}</p>
        </div>
        <i
          class="delete_comment bx bx-x trigger"
          @click="deleteComment(index)"
        ></i>
      </div>
    </div>

    <div v-else class="no_comments_wrapper text_container all_centre">
      <i class="grey large_icon bx bx-comment-detail"></i>

      <h4 class="grey">Be the first to comment on this task</h4>
    </div>

    <div v-if="canInteract" class="create_comment_wrapper">
      <input
        v-model="newMessage"
        placeholder="Write a comment..."
        class="s_input input_comment"
        @keyup.enter="createComment"
      />

      <s-button
        class="rounded only_icon"
        :class="{ disabled: newMessage.length == 0 }"
        icon="send"
        @click="createComment"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { SlideXLeftTransition } from "vue2-transitions";

import scrollToBottom from "@/mixins/scrollToBottom";
import SButton from "@/components/SButton";
import Avatar from "@/components/Avatar";

export default {
  name: "Comments",
  components: {
    Avatar,
    SlideXLeftTransition,
    SButton
  },
  mixins: [scrollToBottom],
  props: {
    comments: {
      type: Array,
      default: () => []
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
    ...mapGetters(["adminPermission"]),
    ...mapState(["userInformation"])
  },

  methods: {
    createComment() {
      this.$emit("createComment", {
        ref: this.$refs.comments_wrapper,
        message: this.newMessage
      }),
        this.reset();
    },
    deleteComment(index) {
      this.$emit("deleteComment", index);
    },
    reset() {
      this.newMessage = "";
      this.commentMessage = "";
      this.editMessage = false;
      this.scrollToBottom(this.$refs.comments_wrapper);
    },
    handleDisplayActions(userID) {
      if (this.adminPermission || userID == this.userInformation._id) {
        this.displayActions = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.comments {
  display: flex;
  flex: 0.3;
  flex-direction: column;
  position: relative;
  max-height: 100%;
  overflow: hidden;
  border-left: $border;
  padding: 10px;
}
.comments_title {
  margin: 20px 0;
}
.comments_wrapper {
  max-height: calc(100% - 100px);
  overflow-x: hidden;
  position: relative;
}
.comment {
  display: flex;
  position: relative;
  flex-direction: column;
  border: $border;
  margin-bottom: 10px;
  font-size: 0.9em;
  max-height: fit-content;
  border-radius: 10px;
  background: rgb(252, 252, 252);

  &:hover {
    .comment_footer {
      display: initial;
    }
  }
}
.input_comment {
  padding: 20px;

  flex: 1;
  margin-right: 10px;
  background: transparent;
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

.create_comment_wrapper {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: $grey;
  padding-right: 20px;
  margin: 10px;
}
.comment_avatar {
  margin-right: 10px;
}
.no_comments_wrapper {
  border-radius: 20px;
}

.delete_comment {
  border: none;
  color: #444;
  position: absolute;
  right: 0;
  top: 0px;
  background: rgb(240, 240, 240);
  &:hover {
    background: rgb(230, 230, 230);
  }
}
.large_icon {
  font-size: 3em;
}
</style>
