<template>
  <!-- Quick actions -->
  <div class="quick_actions_wrapper">
    <div
      v-for="(action, index) in quickActions"
      :key="index"
      v-loading="action.id == quickActionLoading"
      :class="{ disabled: action.condition }"
      class="quick_action_container"
      @click="action.click"
    >
      <InformationDisplay
        :display-text="{
          hasIcon: action.hasOwnProperty('icon'),
          tag: 'h3',
          heading: action.heading,
          content: action.content
        }"
      >
        <i
          v-if="isSuccess.length == 0"
          slot="header"
          :class="action.icon"
          class="quick_action_icon"
        />
      </InformationDisplay>
      <div v-if="isSuccess == action.id" class="check_container">
        <i class="bx bx-check"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import InformationDisplay from "@/components/InformationDisplay";
export default {
  name: "UserManagementActions",
  components: {
    InformationDisplay
  },
  data() {
    return {
      isSuccess: "",
      isSuccessInterval: "",
      quickActionLoading: ""
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["teamInformation"]),
    quickActions() {
      return [
        {
          icon: "bx bx-volume-full",
          heading: "Create announcement",
          id: "create_announcement",
          condition: this.teamInformation.length == 0,
          click: this.createAnnoucement,
          content:
            "Create a system wide notification that will notify all users this can be through email or scheme messenger."
        }
      ];
    }
  },
  methods: {
    ...mapActions(["genPromptBox", "genEmail"]),

    createAnnoucement() {
      this.genPromptBox({
        boxType: "prompt",
        title: "Create annoucement",
        text:
          "You are about to create a system annoucement, this will send an email to all users, please enter the content of the email below",
        type: "info"
      }).then(response => {
        this.quickActionLoading = "create_announcement";
        this.genEmail({
          subject: "Annoucement",
          to: "adenaikeyomi@gmail.com",
          context: {
            body: response.value
          },
          notification: {
            title: "Annoucement",
            message: response.value,
            type: "attention",
            for: [this.userInformation._id]
          }
        }).then(response => {
          this.isSuccess = "create_announcement";
        });
      });
    }
  },

  watch: {
    isSuccess(val) {
      this.isSuccessInterval = setTimeout(() => {
        this.isSuccess = "";
        this.quickActionLoading = "";
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.quick_actions_wrapper {
  display: flex;
  flex-direction: column;
  border: 2px solid whitesmoke;
  background: white;
  margin: 10px;
  flex: 0.5;
  /deep/ {
    .div__body {
      padding: 0;
    }
  }
}

.quick_action_container {
  border-bottom: $border;
  cursor: pointer;
  &.disabled {
    opacity: 0.1;
    pointer-events: none;
  }
  &:hover {
    background: $hover_grey;
    transition: $default_transition background;
  }
}
.quick_action_icon {
  font-size: 1.5em;
}

.check_container {
  background: $success_colour;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  padding: 10px 13px;
}
.title_container {
  background: rgb(250, 250, 250);
  padding: 20px;
}

.mobile {
  .quick_actions_wrapper {
    flex: 1;
  }
}
</style>
