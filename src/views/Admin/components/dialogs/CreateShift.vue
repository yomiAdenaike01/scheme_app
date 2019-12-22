<template>
  <!-- TODO: ADD REASON FOR TIME OFF ADD ATTACHMENT ,FOR SICK NOTES ,ADD VALIDATION -->

  <el-dialog custom-class="event_dialog" :visible.sync="view">
    <Title
      :title="!getIsAdmin ? 'Create Request' : 'Create Shift'"
      :subtitle="
        !getIsAdmin
          ? 'Fill in the form below to create a request.'
          : 'Fill in the form below to create a shift.'
      "
      slot="title"
    />
    <el-form
      class="ml-3 mr-3"
      status-icon
      :rules="validationData"
      label-position="left"
      :model="eventData"
    >
      <el-form-item label="Employee" v-if="getIsAdmin">
        <el-select
          v-model="eventData.assignTo"
          placeholder="Please select a team member you want to assign this to"
        >
          <el-option
            v-for="member in team"
            :key="member._id"
            :label="member.name"
            :value="member._id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Request Type">
        <el-select
          v-model="eventData.eventType"
          :placeholder="getIsAdmin ? '' : 'Holiday'"
        >
          <el-option label="Shift" value="1" v-if="getIsAdmin" />
          <el-option label="Time-Off" value="4" />
          <el-option label="Holiday" value="3" />
          <el-option label="Sick Leave" value="5" />
        </el-select>
      </el-form-item>

      <el-form-item prop="date1" label="Start & End Time ">
        <el-date-picker
          start-placeholder="Start date & time"
          end-placeholder="End date & time"
          type="datetimerange"
          placeholder="Pick a date"
          v-model="eventData.date"
        ></el-date-picker>
      </el-form-item>

      <el-form-item
        label="Repeat Days"
        class="p-4"
        style="background:rgb(250,250,250); border-radius:10px"
      >
        <el-switch v-model="repeat_toggle" />
        <el-collapse-transition>
          <div v-if="repeat_toggle">
            <Title
              subtitle="Select the days of week that you wish to repeat this event for."
            />
            <el-checkbox-group v-model="eventData.repeat_days">
              <el-checkbox-button
                v-for="(btn, index) in repeatDaysConfig"
                :key="btn"
                :label="index"
                >{{ btn }}</el-checkbox-button
              >
            </el-checkbox-group>
          </div>
        </el-collapse-transition>
      </el-form-item>

      <el-form-item
        label="Save As Template"
        class="p-4"
        style="background:rgb(250,250,250); border-radius:10px"
      >
        <el-switch v-model="save_as_template" />
        <el-collapse-transition>
          <div v-if="save_as_template">
            <Title
              subtitle="Your templates will be stored so that you can use them later."
            />
            <el-input
              placeholder="E.g Yearly Time Off"
              v-model="eventData.template_name"
            />
          </div>
        </el-collapse-transition>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        round
        type="primary"
        @click="$emit('createEvent', eventData), $emit('toggle', false)"
        >Publish</el-button
      >
      <el-button round @click="$emit('toggle', false)">Cancel</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'CreateShift',
  data() {
    return {
      repeat_toggle: false,
      save_as_template: false,
      eventData: {
        date: {},
        assignTo: '',

        loading: false,
        eventType: '3',
        repeat_days: [0]
      },
      validationData: {
        startDate: [
          {
            type: 'date',
            required: true,
            message: 'Please pick a date',
            trigger: 'change'
          }
        ],
        endDate: [
          {
            type: 'date',
            required: true,
            message: 'Please pick a date',
            trigger: 'change'
          }
        ]
      },
      success: false
    }
  },
  props: {
    display: Boolean
  },
  computed: {
    ...mapGetters(['getIsAdmin']),
    ...mapState('Admin', ['team']),
    returnTeam() {
      return this.team.filter(member => {
        return member.employee_type != 1
      })
    },
    view: {
      get() {
        return this.display
      },
      set(toggle) {
        this.$emit('toggle', toggle)
      }
    },
    repeatDaysConfig() {
      return ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
    }
  },
  components: {
    Title: () => import('@/components/Title')
  }
}
</script>

<style></style>
