<template>
  <div class="team_container">
    <!-- Display if in mobile view -->

    <div v-if="getFilteredTeam.length > 0">
      <div
        v-for="(member, index) in teamInformation"
        :key="index"
        class="member flex_center"
      >
        <Dropdown
          class="p-2"
          :items="items"
          position="left"
          :icon="false"
          @click.native="hoveredTeamMember = member._id"
          @method="handleEvents"
        >
          <el-badge
            is-dot
            :type="member.isOnline ? 'success' : 'danger'"
            class="item"
          >
            <Avatar :name="member.name" />
          </el-badge>
        </Dropdown>
      </div>
    </div>
    <div v-else class="flex_center h-100">
      <InformationDisplay
        class="p-4"
        :display-text="{
          heading: 'No team members found',
          headingAlign: 'center',
          textAlign: 'center',
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
import { mapState, mapGetters, mapMutations } from "vuex";
import InformationDisplay from "@/components/InformationDisplay";
import Dropdown from "@/components/Dropdown.vue";
import Avatar from "@/components/Avatar.vue";
export default {
  name: "UserSidebar",
  components: {
    Dropdown,
    Avatar,
    InformationDisplay
  },

  data() {
    return {
      hoveredTeamMember: null,
      loaderTimeout: null,
      loadingTeam: true
    };
  },
  computed: {
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters(["getIsAdmin", "getOnlineTeam"]),
    ...mapGetters("Admin", ["getFilteredTeam"]),
    items() {
      let items = [
        // {
        //   name: "Message Team Member",
        //   command: "message"
        // },
        {
          name: "View Team Member",
          command: "view_team_member"
        }
      ];

      return items;
    }
  },
  methods: {
    ...mapMutations(["UPDATE_DIALOG_INDEX"]),

    handleEvents(event) {
      switch (event) {
        case "message": {
          this.$router.push({
            name: "comms",
            params: { id: this.hoveredTeamMember }
          });
          break;
        }
        case "view_team_member": {
          this.UPDATE_DIALOG_INDEX({
            dialog: "viewUser",
            view: true,
            data: this.hoveredTeamMember
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
.team_wrapper {
  border-left: solid 1px #e6e6e6;
  overflow-x: hidden;
}
.team_container {
  border-left: 1px solid #e6e6e6;
  flex: 0.1;
  .member {
    border-bottom: solid 1px #e6e6e6;
    cursor: pointer;
    &:hover {
      background-color: darken($color: #ffff, $amount: 2);
    }
  }
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
