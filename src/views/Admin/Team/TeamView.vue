<template>
  <el-col class="team_wrapper" v-loading="team.length <= 0">
    <el-row class="team_container">
      <Title
        style="text-align:center"
        v-if="$mq != 'lg'"
        title="Team"
        subtitle="View and interact with your team members here"
      />

      <el-col v-for="(member, index) in team" :key="index" class="member">
        <Dropdown
          @click.native="hoveredTeamMember = member._id"
          :items="items"
          @method="handleEvents"
          position="left"
          :icon="false"
        >
          <el-badge is-dot :type="member.is_online ? 'success' : 'danger'" class="item">
            <Avatar :name="member.name" />
          </el-badge>
        </Dropdown>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import Dropdown from "@/components/Dropdown.vue";
import Avatar from "@/components/Avatar.vue";
import Title from "@/components/Title";
export default {
  name: "Team",
  data() {
    return {
      hoveredTeamMember: null
    };
  },
  computed: {
    ...mapState("Admin", ["team"]),
    ...mapGetters(["getIsAdmin", "getOnlineTeam"]),
    onlineTeam() {
      return this.team.filter(member => {
        return member.is_online;
      });
    },
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
    ...mapMutations("Admin", ["UPDATE_VIEW_TEAM_MEMBER"]),
    handleEvents(event) {
      switch (event) {
        case "message": {
          this.$router.push({ name: "messenger" });
          break;
        }
        case "view_team_member": {
          this.UPDATE_VIEW_TEAM_MEMBER({
            view: true,
            id: this.hoveredTeamMember
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
    Title
  }
};
</script>

<style lang="scss" scoped>
.team_wrapper {
  width: 5%;
  border-left: solid 1px #e6e6e6;
  height: 100%;
  overflow-x: hidden;
}
.team_container {
  .el-col {
    padding: 1em;
    border-bottom: solid 1px #e6e6e6;
    cursor: pointer;
    &:hover {
      background-color: darken($color: #ffff, $amount: 2);
    }
  }
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
    width: 100%;
    border-left: none;
  }
}
</style>
