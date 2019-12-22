<template>
  <el-dialog :visible.sync="view">
    <el-row slot="title" type="flex">
      <el-col>
        <Title
          title="Details"
          subtitle="View and edit the details of the shift/event/request here."
          defaultClass="m-0"
        />
      </el-col>
      <el-col style="display:flex; justify-content:flex-end">
        <el-tag class="mt-4 mr-4" v-if="shift.is_pickup"
          >Avaliable For Pickup</el-tag
        >
      </el-col>
    </el-row>

    <el-form>
      <el-form-item label="Assignee:">
        <p class="member_name">{{ shift.assigned_to }}</p>
      </el-form-item>
      <el-form-item label="Approved:">
        <p class="member_name">
          <i class="el-icon" :class="returnIcon" style="font-size:1.4em"></i>
          <el-button class="ml-3" v-if="!getIsAdmin">Resend Request</el-button>
        </p>
      </el-form-item>
      <el-form-item label="Shift Type:">
        {{ shift.type }}
      </el-form-item>
      <el-divider><span class="grey">Timing</span></el-divider>
      <el-form-item label="Start Date Time:">
        <span>{{ shift.start }}</span>
      </el-form-item>
      <el-form-item label="End Date Time:">
        <span>{{ shift.end }}</span>
      </el-form-item>
      <el-row type="flex" :gutter="5">
        <el-col v-if="shift.is_pickup">
          <el-button style="width:100%" type="primary" plain>Pickup</el-button>
        </el-col>
        <el-col v-if="!shift.is_pickup">
          <el-button
            style="width:100%"
            type="danger"
            plain
            @click="confirm('delete')"
            >Drop</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import Title from '@/components/Title'

export default {
  name: 'ViewShift',
  props: {
    shift: Object,
    display: Boolean
  },
  computed: {
    ...mapGetters(['getIsAdmin']),
    ...mapState(['currentUser']),
    isMine() {
      return this.shift.assigned_to == this.currentUser._id
    },
    returnIcon() {
      let approved = this.returnApproval
      let returnval
      if (approved) {
        returnval = 'el-icon-circle-check'
      } else {
        returnval = 'el-icon-circle-close'
      }
      return returnval
    },
    returnApproval() {
      if (this.returnShiftDetails) {
        let approval = this.returnShiftDetails.is_approved
        let returnval = false
        if (approval.admin == 1) {
          returnval = true
        }
        return returnval
      }
    },
    view: {
      get() {
        return this.display
      },
      set(val) {
        this.$emit('toggle', val)
      }
    }
  },
  methods: {
    ...mapActions(['request']),
    ...mapMutations(['UPDATE_NOTIFICATIONS']),
    confirm(question) {
      switch (question) {
        case 'delete':
          this.$confirm(
            `Are you sure you want to drop this event ?`,
            'Drop Event',
            {
              confirmButtonText: 'Ok',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }
          )
            .then(response => {
              this.updateShift({ assigned_to: '', is_pickup: true })
            })
            .catch(error => {
              return error
            })
          break
        case 'pickup':
          this.$confirm(
            `Are you sure you want to pickup this event ?`,
            'Pickup Event',
            {
              confirmButtonText: 'Ok',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }
          )
            .then(response => {
              this.updateShift({
                is_pickup: false,
                assigned_to: this.currentUser._id
              })
            })
            .catch(error => {
              return error
            })
          break

        default:
          break
      }
    },

    updateShift(update) {
      return console.log(update)
      this.$emit('loading', true)
      this.request({
        method: 'POST',
        url: '/shifts/update',
        data: {
          shift_id: this.shift.id,
          shift_update: update
        }
      })
        .then(response => {
          this.$emit('loading', false)
          this.$emit('toggle', false)
          this.UPDATE_NOTIFICATIONS({
            title: 'Operation successful',
            message: 'Shift successfully updated.',
            type: 'success'
          })
        })
        .catch(error => {
          this.$emit('loading', false)
        })
    }
  },
  components: {
    Title
  }
}
</script>

<style></style>
