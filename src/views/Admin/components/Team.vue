<template>
  <el-col style="flex:0.2;border-left:solid 1px #e6e6e6;">
    <el-row class="team_container">
      <el-col v-for="(member, index) in team" :key="index">
        <Dropdown
          :items="items"
          @method="handleEvents"
          position="left"
          :icon="false"
        >
          <Avatar :name="member.name" />
        </Dropdown>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import { mapState } from 'vuex'
import Dropdown from '@/components/Dropdown.vue'
import Avatar from '@/components/Avatar.vue'
export default {
  name: 'Team',
  computed: {
    ...mapState('Admin', ['team']),
    items() {
      return [
        {
          name: 'Message',
          command: 'message'
        },
        {
          name: 'View Requests',
          command: 'requests',
          divided: true
        }
      ]
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
