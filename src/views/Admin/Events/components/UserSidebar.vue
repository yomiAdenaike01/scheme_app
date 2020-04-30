<template>
  <div class="team_container">
    <!-- Display if in mobile view -->

    <div v-if="getFilteredTeam.length > 0" class="users_container">
      <div
        v-for="(member, index) in team"
        :key="index"
        class="team_member_container"
      >
        <Dropdown
          :items="items"
          position="left"
          :icon="false"
          @click.native="selectedUser = member"
          @method="handleEvents"
        >
          <Avatar :name="member.name" :size="40">
            <OnlineIndicator :is-online="member.is_online" />
          </Avatar>
        </Dropdown>
      </div>
    </div>
    <div v-else class="information_container">
      <InformationDisplay
        :display-text="{
          heading: 'No team members found',
          headingAlign: 'center',
          textAlign: 'center',
          tag: 'h3',
          hasIcon: true,
          content:
            'To create a team member please navigate to user management and manage users to create team members'
        }"
        mode="title"
      >
        <i slot="header" class="bx bx-user flex_center"></i>
        <el-button slot="body" round @click="$router.push({ name: 'user' })"
          >Go to user management</el-button
        >
      </InformationDisplay>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import InformationDisplay from "@/components/InformationDisplay";
import Dropdown from "@/components/Dropdown.vue";
import Avatar from "@/components/Avatar.vue";
export default {
  name: "UserSidebar",
  components: {
    Dropdown,
    Avatar,
    InformationDisplay,
    OnlineIndicator: () => import("@/components/OnlineIndicator")
  },

  data() {
    return {
      selectedUser: null,
      loaderTimeout: null,
      loadingTeam: true
    };
  },
  computed: {
    ...mapState(["team"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getFilteredTeam"]),
    items() {
      return [
        {
          name: "Message",
          command: "message"
        },
        {
          name: "View",
          command: "view_team_member"
        }
      ];
    }
  },
  methods: {
    ...mapActions("Comms", ["createStubChat"]),
    ...mapMutations(["UPDATE_DIALOG_INDEX"]),

    handleEvents(event) {
      switch (event) {
        case "message": {
          this.$router.push({
            name: "comms",
            params: {
              userToMessage: {
                name: this.selectedUser?.name,
                _id: this.selectedUser?._id
              }
            }
          });
          this.createStubChat();
          break;
        }
        case "view_team_member": {
          this.UPDATE_DIALOG_INDEX({
            dialog: "profile",
            view: true,
            data: this.selectedUser
          });
          break;
        }

        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.team_container {
  border-left: 1px solid #e6e6e6;
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
.users_container {
  display: flex;
  flex-direction: column;
}

.team_center {
  align-items: center;
  display: flex;
  justify-content: center;
}
.information_container {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
