<template>
  <el-row
    type="flex"
    @click.native="UPDATE_VIEW_USER(data.assigned_to)"
    class="table_employee"
  >
    <el-col style="flex:0.2" class="mr-3">
      <Avatar :name="findMember.name" />
    </el-col>
    <el-col>
      <span class="member_name black">{{ findMember.name }}</span>
      <p>{{ employeeType }}</p>
      <br />
    </el-col>
  </el-row>
</template>

<script>
import Avatar from '@/components/Avatar'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'TableEmployee',
  mounted() {},
  props: {
    data: Object
  },
  components: {
    Avatar
  },
  methods: {
    ...mapMutations('Admin', ['UPDATE_VIEW_USER'])
  },
  computed: {
    ...mapState('Admin', ['team']),
    findMember() {
      let returnValue
      let foundMember = this.team.find(member => {
        return member._id == this.data.assigned_to
      })
      if (foundMember) {
        returnValue = foundMember
      } else {
        returnValue = { name: 'John Doe', employee_type: 2 }
      }
      return returnValue
    },
    employeeType() {
      const type = this.findMember.employee_type
      let typeString
      switch (type) {
        case 1: {
          typeString = 'Admin'
          break
        }
        case 2: {
          typeString = 'Regular Staff'
          break
        }
        case 3: {
          typeString = 'Locumn'
          break
        }
      }
      return typeString
    }
  }
}
</script>

<style lang="scss" scoped>
.table_employee {
  cursor: pointer;
}
strong {
  text-transform: capitalize;
}
.position {
  font-size: 0.8em;
}
</style>
