<template>
  <div class="comments_container">
    <div class="full_mode_container">
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
          <s-button
            v-show="canInteract"
            class="icon_only tertiary delete_comment"
            icon="close"
            @click="
              $emit('deleteComment', {
                commentIndex: index,
                _id: comment._id
              })
            "
          />
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
          class="input_comment"
          @keyup.enter="createComment"
        />

        <s-button
          class="only_icon secondary"
          :class="{ disabled: newMessage.length == 0 }"
          icon="send"
          @click="createComment"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { SlideXLeftTransition } from "vue2-transitions";

import SButton from "@/components/SButton";
import Avatar from "@/components/Avatar";
import ActionIcon from "@/components/ActionIcon";

export default {
  name: "Comments",
  components: {
    ActionIcon,
    Avatar,
    SlideXLeftTransition,
    SButton
  },
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
    reset() {
      this.newMessage = "";
      this.commentMessage = "";
      this.editMessage = false;
    },
    handleDisplayActions(userID) {
      if (this.adminPermission || userID == this.userInformation._id) {
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
.full_mode_container {
  height: 100%;
}
.comments_container {
  height: 100%;
}
.comments_wrapper {
  max-height: calc(100% - 750px);
  overflow-x: hidden;
}
.comment {
  display: flex;
  position: relative;
  flex-direction: column;
  background: rgb(250, 250, 250);
  margin-bottom: 10px;
  max-height: fit-content;
  border-radius: 10px;
  &:hover {
    .comment_footer {
      display: initial;
    }
  }
}
.input_comment {
  padding: 20px;
  border: none;
  outline: none;
  background: $grey;
  flex: 1;
  margin-right: 10px;
  border-radius: 10px;
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
  padding: 20px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.comment_avatar {
  margin-right: 10px;
}
.no_comments_wrapper {
  background: rgb(250, 250, 250);
  padding: 20px;
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
