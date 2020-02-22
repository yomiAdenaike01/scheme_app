<template>
  <div class="team_container" v-loading="false">
    <!-- Display if in mobile view -->
    <Title
      style="text-align:center"
      v-if="$mq != 'lg'"
      title="teamInformation"
      subtitle="View and interact with your team members here"
    />
    <div v-if="getFilteredTeam.length > 0">
      <div v-for="(member, index) in teamInformation" :key="index" class="member flex_center">
        <Dropdown
          class="p-2"
          @click.native="hoveredTeamMember = member._id"
          :items="items"
          @method="handleEvents"
          position="left"
          :icon="false"
        >
          <el-badge is-dot :type="member.isOnline ? 'success' : 'danger'" class="item">
            <Avatar :name="member.name" />
          </el-badge>
        </Dropdown>
      </div>
    </div>
    <Nocontent
      v-else
      :moreInformation="
          getIsAdmin
            ? null
            : {
                index: 'admin',
                instruction: 'team_viewing',
                hoverPosition: 'bottom-end'
              }
        "
      text="No team members detected, hover over the button below for more information."
      icon="el-icon-user"
    >
      <el-button
        round
        type="primary"
        @click="$router.push({ name: 'schedule' })"
        size="mini"
      >Create Team Member</el-button>
    </Nocontent>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import Dropdown from "@/components/Dropdown.vue";
import Avatar from "@/components/Avatar.vue";
import Title from "@/components/Title";
import MoreInformation from "@/components/MoreInformation";
import Nocontent from "@/components/Nocontent";
export default {
  name: "UserSidebar",
  created() {
    this.teamLoaderManager();
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
        {
          name: "Message Team Member",
          command: "message"
        }
      ];

      if (this.getIsAdmin) {
        items.push({
          name: "View Team Member",
          command: "view_team_member"
        });
      }
      return items;
    }
  },
  methods: {
    ...mapMutations(["UPDATE_DIALOG_INDEX"]),
    teamLoaderManager() {
      this.loaderTimeout = setTimeout(() => {
        if (this.teamInformation.length <= 0) {
          this.loadingTeam = false;
          this.noTeam = true;
        } else {
          this.loadingTeam;
        }
      }, 5000);
    },
    handleEvents(event) {
      switch (event) {
        case "message": {
          this.$router.push({ name: "messenger" });
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
  },
  components: {
    Dropdown,
    Avatar,
    Title,
    MoreInformation,
    Nocontent
  }
};
</script>

<style lang="scss" scoped>
.team_wrapper {
  border-left: solid 1px #e6e6e6;
  overflow-x: hidden;
}
.team_container {
  flex: 0.1;
  border-left: 1px solid #e6e6e6;
  .member {
    border-bottom: solid 1px #e6e6e6;
    cursor: pointer;
    &:hover {
      background-color: darken($color: #ffff, $amount: 2);
    }
  }
}
.team_center {
  display: flex;
  align-items: center;
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
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .team_container {
    border-top: 1px solid #e6e6e6;
  }
  .team_wrapper {
    border-left: none;
  }
}
</style>
