<template>
  <el-dialog :visible.sync="toggleView">
    <div v-if="team.length > 0">
      <Title
        title="Start new chat."
        subtitle="Select a team member to chat to."
      />
      <!-- Select team member -->
      <el-select v-model="initContent.reciever_id" filterable>
        <el-option
          v-for="member in team"
          :value="member._id"
          :label="member.name"
          :key="member._id"
          >{{ member.name }}</el-option
        >
      </el-select>
      <!-- Type first message -->
      <el-collapse-transition>
        <el-input
          class="mt-4"
          v-if="initContent.reciever_id"
          placeholder="Type first message here."
          v-model="initContent.content"
          @keyup.enter="initTranscript"
        >
          <template slot="append">
            <el-button
              icon="el-icon-position"
              @click="initTranscript"
            ></el-button>
          </template>
        </el-input>
      </el-collapse-transition>
    </div>
    <!-- No team members -->
    <div v-else>
      <h3>No team members</h3>
    </div>
  </el-dialog>
</template>

<script>
import Title from "@/components/Title";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "NewChatDialog",
  data() {
    return {
      initContent: {
        reciever_id: "",
        content: "",
        attachments: ""
      }
    };
  },
  props: {
    view: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("Admin", ["team"]),
    ...mapState("Comms", ["startNewChat"]),
    filteredTeam() {
      // Is there a transcript with that ID.
    },
    toggleView: {
      get() {
        return this.startNewChat;
      },
      set(val) {
        this.UPDATE_START_NEW_CHAT(val);
      }
    }
  },
  methods: {
    ...mapActions("Comms", ["startChat"]),
    ...mapMutations("Comms", ["UPDATE_START_NEW_CHAT"]),
    //start
    initTranscript() {
      this.startChat(this.initContent)
        .then(response => {
          // Close dialog
          this.UPDATE_START_NEW_CHAT(false);
          return response;
        })
        .catch(error => {
          return error;
        });
    }
  },
  components: {
    Title
  }
};
</script>

<style></style>
