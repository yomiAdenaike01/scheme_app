<template>
  <el-row
    ref="notification"
    class="p-3 m-1"
    style="width:100%;background:rgb(253,253,253);border-left:2px solid rgb(220,220,220);"
  >
    <el-col style="width:100%; ">
      <el-row type="flex" align="middle">
        <el-col>
          <span style="font-size:.8em">{{ `${notification.message}.` }}</span>
        </el-col>

        <el-col
          style="flex:1;display:flex; juistfy-content:center; align-items:center; flex-direction:column"
        >
          <el-button
            size="small"
            style="width:100%"
            v-if="!notification.is_read"
            @click="
              updateContent('/notifications/update', {
                method: 'POST',
                update: { is_read: true, id: notification._id }
              })
            "
            >Mark as read</el-button
          >
          <el-button
            plain
            type="danger"
            size="small"
            class="m-0"
            style="width:100%"
            @click="deleteNotifcation"
            >Delete Notification</el-button
          >
          <el-button
            size="small"
            class="m-0"
            style="width:100%"
            type="primary"
            plain
            v-if="notification.type == 'approve'"
            @click="viewDetails = !viewDetails"
            >Toggle view details</el-button
          >
        </el-col>
      </el-row>
    </el-col>
    <el-collapse-transition>
      <el-col
        v-if="viewDetails"
        class="p-3 mt-3"
        style="background:rgb(249,249,249); color:#444"
      >
        <p style="text-align:center; font-size:.8em">
          Please confirm that you want to approve these changes
        </p>
        <div class="update_content p-3">
          <p
            class="mb-1"
            v-for="(prop, index) in notificationUpdate"
            :key="index"
          >
            <span class="member_name">{{ index.toLowerCase() }}:</span>
            {{ prop }}
          </p>
          <el-button
            class="check_button mt-4"
            circle
            icon="el-icon-check"
            size="small"
            @click="updateContent(notification.url, notification.content)"
          ></el-button>
        </div>
      </el-col>
    </el-collapse-transition>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import dates from '@/mixins/dates'
export default {
  name: 'Notification',
  mixins: [dates],
  data() {
    return {
      viewDetails: false,
      formatString: 'DD/MMMM/YYYY HH:mm'
    }
  },
  computed: {
    startDate() {
      return this.format(this.update.startDate, this.formatString)
    },
    endDate() {
      return this.format(this.update.endDate, this.formatString)
    },
    notificationUpdate() {
      return this.notification.content.data
    }
  },
  props: {
    notification: Object
  },
  methods: {
    ...mapActions(['request']),
    deleteNotifcation() {
      this.request({
        method: 'DELETE',
        url: '/notifications/one',
        data: {
          id: this.notification._id
        }
      })
        .then(response => {})
        .catch(error => {})
    },
    updateContent(url, updateContent) {
      let payload = {
        method: updateContent.method,
        url: url,
        data: updateContent.data || updateContent.update
      }
      this.request(payload)
        .then(response => {
          this.UPDATE_NOTIFICATIONS({ message: '', type: 'success' })
        })
        .catch(error => {})
    }
  }
}
</script>
<style lang="scss">
.update_content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 0.8em;
}
.check_button {
  border: 1px solid #2f74eb;
  .el-icon-check {
    color: #2f74eb;
  }
}
</style>
