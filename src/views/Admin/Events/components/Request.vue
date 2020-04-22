<template>
  <div class="request_container">
    <div class="request_header">
      <p>{{ request.type.label }} request</p>
      <div class="requestee_container">
        <Avatar :size="size" :name="request.requestedBy.name" />
        <p class="grey">
          <span class="request_user_name">{{ request.requestedBy.name }}</span>
          requested
          <span class="date">{{
            initMoment(request.dateCreated).calendar()
          }}</span>
        </p>
      </div>
    </div>
    <!-- Duration container -->
    <div class="duration_container">
      <span>{{ duration }} days</span>
      <p>
        {{ formatDate(request.startDate, "MMMM DD") }} -
        {{ formatDate(request.endDate, "MMMM DD") }}
      </p>
    </div>
    <p>Notes</p>
    <p class="grey">{{ request.notes }}</p>
    <!-- Apporval -->
    <p>Approval</p>
    <div class="steps_container">
      <div
        v-for="(step, index) in stepXref"
        :key="index"
        class="step"
        :class="[
          step.toLowerCase(),
          {
            exceeded: stepXref.indexOf(request.status.capitalize()) > index,
            active_step: stepXref.indexOf(request.status.capitalize()) == index
          }
        ]"
      >
        <span>{{ step }}</span>
      </div>
    </div>
    <div class="approval_wrapper">
      <el-button plain type="success">Approve</el-button>
      <el-button plain type="danger">Reject</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "Request",
  components: {
    Avatar: () => import("@/components/Avatar")
  },
  props: {
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
    stepXref() {
      return ["Sent", "Seen", "Approved", "Rejected"];
    },
    duration() {
      let endDate = moment(this.request.endDate);
      let duration = moment.duration(endDate.diff(this.request.startDate));
      return Math.round(
        duration.asHours() > 24 ? duration.asDays() : duration.asHours()
      );
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
  border: 2px solid rgb(235, 235, 235);
  margin: 40px;
  padding: 20px;
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
.steps_container {
  display: flex;
  align-items: center;
  margin: 0 0 40px 0;
  justify-content: center;
}
.step {
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
  &.active_step {
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
</style>
