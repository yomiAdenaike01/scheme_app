<template>
  <div class="team_container">
    <!-- Display if in mobile view -->

    <div v-if="getFilteredTeam.length > 0" class="team_members_container">
      <el-popover
        v-for="(member, teamIndex) in team"
        :key="teamIndex"
        placement="left"
      >
        <div
          slot="reference"
          class="team_member_container"
          @click="selectedTeamMember = member"
        >
          <Avatar :name="member.name" :size="40">
            <OnlineIndicator :is-online="member.is_online" />
          </Avatar>
        </div>
        <div
          v-for="(item, index) in items"
          :key="index"
          class="popover_item"
          @click="item.method"
        >
          <span v-html="item.name"></span>
        </div>
      </el-popover>
    </div>
    <div v-else class="text_container all_centre">
      <i class="bx bx-user flex_center"></i>
      <h3>No team members found</h3>
      <p>
        To create a team member please navigate to user management and manage
        users to create team members
      </p>

      <s-button class="rounded primary" @click="$router.push({ name: 'user' })"
        >Go to user management</s-button
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Dropdown from "@/components/Dropdown.vue";
import Avatar from "@/components/Avatar.vue";
import OnlineIndicator from "@/components/OnlineIndicator";
import SButton from "@/components/SButton";
export default {
  name: "TeamSidebar",
  components: {
    Dropdown,
    Avatar,
    OnlineIndicator,
    SButton
  },

  data() {
    return {
      selectedTeamMember: null,
      loaderTimeout: null,
      loadingTeam: true
    };
  },
  computed: {
    ...mapState("Team", ["team"]),
    ...mapGetters(["adminPermission"]),
    ...mapGetters("Team", ["getFilteredTeam"]),
    items() {
      let items = [
        {
          name: "Message",
          method: this.handleComms
        }
      ];
      if (this.adminPermission) {
        items.push(
          {
            name: " View events",
            method: this.handleViewTeamMember
          },
          {
            name: " View Requests ",
            method: this.handleRequests
          }
        );
      }
      return items;
    }
  },
  methods: {
    ...mapActions("Comms", ["createStubChat"]),
    ...mapMutations(["UPDATE_OVERLAY_INDEX"]),
    handleViewTeamMember() {
      this.$router.push({
        name: "team",
        params: {
          user: this.selectedTeamMember?.name,
          tab: "events_timeline"
        }
      });
    },
    handleRequests() {
      this.$router.push({
        name: "requests",
        params: { teamMember: this.selectedTeamMember }
      });
    },
    handleComms() {
      this.$router.push({
        name: "comms",
        params: {
          userToMessage: {
            name: this.selectedTeamMember?.name,
            _id: this.selectedTeamMember?._id
          }
        }
      });
      this.createStubChat();
    }
  }
};
</script>

<style lang="scss" scoped>
.team_container {
  border-left: 1px solid #e6e6e6;
  background: white;
  flex: 0.1;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.team_member_container {
  border-bottom: solid 1px #e6e6e6;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: darken($color: #ffff, $amount: 2);
  }
}
.team_members_container {
  display: flex;
  flex-direction: column;
}

.team_center {
  align-items: center;
  display: flex;
  justify-content: center;
}

/**
 _   _  _  ___ _  _    ___
| \_/ |/ \| o ) || |  | __|
| \_/ ( o ) o \ || |_ | _|
|_| |_|\_/|___/_||___||___|

 */
.mobile {
  .member {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .team_container {
    border-top: 1px solid #e6e6e6;
  }
  .team_wrapper {
    border-left: none;
  }
}
</style>
