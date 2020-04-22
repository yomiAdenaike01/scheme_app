<template>
  <div class="request_container">
    <div class="request_header">
      <h4>{{ request.type.label }} request</h4>
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
      <p>{{ duration }}</p>
    </div>
    <p>Notes</p>
    <p>{{ request.notes }}</p>
    <!-- Apporval -->
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
      <Avatar :size="size" :name="userInformation.name" />
      <div class="buttons_wrapper">
        <el-button type="success">Approve</el-button>
        <el-button type="info">Reject</el-button>
      </div>
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
}
.steps_container {
  display: flex;
  align-items: center;
  margin: 40px 0;
  justify-content: center;
}
.step {
  border-radius: 60px;
  border: 2px solid #ccc;
  border-right: none;
  padding: 8px 30px;
  font-size: 0.8em;
  text-transform: uppercase;
  border-radius: 60px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  position: relative;
  margin-right: -10px;
  color: #ccc;
  &.exceeded {
    background: #27941d;
    color: white;
    border-color: white;
  }
  &.active_step {
    background: orange;
    color: white;
    border-color: white;
  }
  &:last-of-type {
    border-right: 2px solid inherit;
    border-top-right-radius: 60px;
    border-bottom-right-radius: 60px;
  }
}
</style>
