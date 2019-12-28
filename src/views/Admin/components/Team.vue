<template>
  <el-col class="team_wrapper">
    <el-row class="team_container">
      <el-col v-for="(member, index) in team" :key="index">
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
    Avatar
  }
}
</script>

<style lang="scss" scoped>
.team_wrapper {
  width: 9.5%;
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
</style>
