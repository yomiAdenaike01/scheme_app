<template>
  <div
    class="event_template_container p-3 m-3 trigger"
    ref="templateContainer"
    v-loading="loading"
    @click="displayDetails = !displayDetails"
  >
    <div class="flex flex--space-between align-center">
      <div>
        <h4 class="member_name">{{data.name}}</h4>
        <p>{{getGroupName('event',data.content.type).name}}</p>
      </div>
      <div>
        <el-button circle icon="el-icon-delete" @click="deleteTemplate" />
        <el-button circle icon="el-icon-share" @click="shareTemplate" />
      </div>
    </div>
    <el-collapse-transition>
      <div v-if="displayDetails" class="mt-3">
        <h3>Details</h3>
        {{getEventAssignedTo(data.content.assignedTo).text}}
        <br />
        {{formatDate(data.startDate)}}
        <br />
        {{formatDate(data.endDate)}}
        <br />
        {{formatDate(data.dateCreated)}}
        <br />
        {{formattedWeekdays}}
        <br />
        <el-button class="w-100 mt-3" plain type="primary" size="mini">Use template</el-button>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Popover from "@/components/Popover";
export default {
  name: "EventTemplate",
  data() {
    return {
      loading: false,
      sharedUser: "",
      displayDetails: false
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters("Admin", ["getGroupName", "getEventAssignedTo"]),
    ...mapState(["daysOfWeek"]),
    content() {
      return this.data.content;
    },
    formattedWeekdays() {
      let _daysOfWeek = [...this.content.repeat.weekdays];
      return _daysOfWeek
        .map((days, index) => {
          days = days - 1;
          return this.daysOfWeek[days].text;
        })
        .join(", ");
    }
  },
  methods: {
    ...mapActions(["request"]),
    shareTemplate() {
      return console.log("sharing template");
      this.request({
        method: "POST",
        url: "events/templates/share",
        data: { id: this.data._id, user: sharedUser }
      })
        .then(response => {
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.loading = true;
          console.log(err);
        });
    },
    deleteTemplate() {
      this.loading = true;
      this.request({
        method: "DELETE",
        url: "events/templates/delete",
        data: { id: this.data._id }
      })
        .then(response => {
          this.loading = false;

          this.$refs.templateContainer.remove();
          this.$emit("toggle", false);
        })
        .catch(err => {
          this.loading = false;
          this.loading = true;
          console.log(err);
        });
    }
  },
  components: {
    Popover
  }
};
</script>

<style lang="scss" scoped>
.event_template_container {
  border: 1px solid #efefef;
  border-radius: 10px;
}
</style>