<template>
  <el-col class="team_wrapper">
    <el-row class="team_container">
      <Title
        style="text-align:center"
        v-if="$mq != 'lg'"
        title="Team"
        subtitle="View and interact with your team members here"
      />
      <el-col v-for="(member, index) in team" :key="index" class="member">
        <Dropdown
          :items="items"
          @method="handleEvents"
          position="left"
          :icon="false"
        >
          <el-badge
            is-dot
            type="success"
            :hidden="member.is_online"
            class="item"
          >
            <Avatar :name="member.name" />
          </el-badge>
        </Dropdown>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Dropdown from '@/components/Dropdown.vue'
import Avatar from '@/components/Avatar.vue'
import Title from '@/components/Title'
export default {
  name: 'Team',
  computed: {
    ...mapState('Admin', ['team']),
    ...mapGetters(['getIsAdmin', 'getOnlineTeam']),
    onlineTeam() {
      return this.team.filter(member => {
        return member.is_online
      })
    },
    items() {
      let items = [
        {
          name: 'Message Team Member',
          command: 'message'
        },
        {
          name: 'View Team Member',
          command: 'view_member'
        },
        {
          name: 'View Requests',
          command: 'requests',
          divided: true
        }
      ]

      if (!this.getIsAdmin) {
        items.splice(
          items.findIndex(item => item.command == 'requests'),
          1
        )
      }
      return items
    }
  },
  methods: {
    handleEvents(event) {
      switch (event) {
        case 'message': {
          this.$router.push({ name: 'messenger' })
          break
        }
        case 'view_requests': {
          break
        }

        default:
          break
      }
    }
  },
  components: {
    Dropdown,
    Avatar,
    Title
  }
}
</script>

<style lang="scss" scoped>
.team_wrapper {
  width: 5%;
  border-left: solid 1px #e6e6e6;
  height: 100%;
  overflow-y: scroll;
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
