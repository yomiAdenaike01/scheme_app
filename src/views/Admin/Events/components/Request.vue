<template>
  <div class="request_container">
    <div class="request_header">
      <p>{{ request.type.label }} request</p>
      <div class="requestee_container">
        <Avatar :size="size" :name="requestedName" />
        <p class="grey">
          <span class="request_user_name">{{ requestedName }}</span>
          requested
          <span class="date">{{
            initMoment(request.date_created).calendar()
          }}</span>
        </p>
      </div>
    </div>
    <!-- Duration container -->
    <div class="duration_container">
      <span>{{ duration }} days</span>
      <p>
        {{ formatDate(request.start_date, "MMMM DD") }} -
        {{ formatDate(request.end_date, "MMMM DD") }}
      </p>
    </div>
    <p>Notes</p>
    <p class="grey request_notes">
      {{ request.notes ? request.notes : "No notes found" }}
    </p>
    <!-- Apporval -->
    <p>Approval</p>
    <div class="statuses_container">
      <div
        v-for="(status, index) in statusXref"
        :key="index"
        class="status"
        :class="[
          status,
          {
            exceeded: statusXref.indexOf(request.status) > index,
            active_status: statusXref.indexOf(request.status) == index
          }
        ]"
      >
        <span>{{ status }}</span>
      </div>
    </div>
    <div class="approval_wrapper">
      <Avatar :name="userInformation.name" />
      <el-button
        plain
        type="success"
        @click="updateRequest({ status: 'approved' })"
        >Approve</el-button
      >
      <el-button
        plain
        type="danger"
        @click="updateRequest({ status: 'rejected' })"
        >Reject</el-button
      >
      <el-button
        v-if="getIsAdmin || request.requested_by._id == userInformation._id"
        icon="el-icon-close"
        type="text"
        circle
        @click="deleteRequest"
      ></el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "Request",
  components: {
    Avatar: () => import("@/components/Avatar")
  },
  props: {
    requestIndex: {
      type: Number,
      default: 0
    },
    request: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      size: 35
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    statusXref() {
      return ["sent", "seen", "approved", "rejected"];
    },
    requestedName() {
      return this.request?.requested_by?.name ?? "Username";
    },
    duration() {
      let end_date = moment(this.request.end_date);
      let duration = moment.duration(end_date.diff(this.request.start_date));
      return Math.round(
        duration.asHours() > 24 ? duration.asDays() : duration.asHours()
      );
    }
  },
  methods: {
    ...mapMutations("Admin", ["UPDATE_REQUEST", "DELETE_REQUEST"]),
    updateRequest(payload) {
      this.UPDATE_REQUEST({ request: payload, index: this.requestIndex });
    },
    deleteRequest() {
      this.DELETE_REQUEST(this.requestIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
.request_container {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 10px;
  border: 1px solid rgb(235, 235, 235);
  margin: 20px;
  max-width: 25%;
  min-width: 25%;
}
.approval_wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  > * {
    flex: 1;
  }
}
.request_header {
  padding: 10px;
}
.requestee_container {
  display: flex;
  align-items: center;
  padding: 10px;
  .avatar_container {
    margin-right: 5px;
  }
}
.request_user_name {
  text-transform: capitalize;
}
.date {
  text-transform: lowercase;
}
.duration_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgb(240, 240, 240);
  color: #888;
  span {
    margin-top: 10px;
  }
  p {
    text-transform: uppercase;
    font-weight: 300;
  }
}
.statuses_container {
  display: flex;
  align-items: center;
  margin: 0 0 40px 0;
  justify-content: center;
}
.status {
  border-radius: 60px;
  border: 1px solid #fff;
  background: #f4f4f5;
  border-right: none;
  padding: 8px 30px;
  font-size: 0.8em;
  text-transform: uppercase;
  border-radius: 60px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  position: relative;
  margin-right: -10px;
  color: #999;
  &.exceeded {
    background: darken(#f0f9eb, 3);
    border-color: #fff;
    color: #67c23a;
  }
  &.active_status {
    background: darken(#fdf6ec, 3);
    color: #e6a23c;
    border-color: white;
  }
  &:last-of-type {
    border-right: 2px solid inherit;
    border-top-right-radius: 60px;
    border-bottom-right-radius: 60px;
  }
}
.request_notes {
  line-height: 1.7em;
}
</style>
