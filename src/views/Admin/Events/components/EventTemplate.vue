<template>
<div>
        <h2 class="capitalize mr-3">{{ data.name }}</h2>

  <div
    class="event_template_container p-3 m-3 trigger"
    ref="templateContainer"
    v-loading="loading"
    @click="displayDetails = !displayDetails"
  >
    <div class="flex flex--space-between align-center">
      <div>
        <small
          ><strong>{{ formatDate(data.dateCreated) }}</strong></small
        >

        <p>{{ getGroupName("event", data.content.type).name }}</p>
      </div>
      <div>
        <el-button circle icon="el-icon-delete" @click="deleteTemplate" />
        <el-button circle icon="el-icon-share" @click="shareTemplate" />
      </div>
    </div>
    <el-collapse-transition>
      <div v-if="displayDetails" class="mt-3">
        <h2>Details</h2>
        {{ getEventAssignedTo(data.content.assignedTo).text }}
        <br />
        {{ formatDate(data.content.startDate) }}
        <br />
        {{ formatDate(data.content.endDate) }}
        <br />
        <br />
        <h2>Repeat on</h2>
        {{ formattedWeekdays }}
        <br />
        <el-button
          class="w-100 mt-3"
          @click="applyTemplate"
          plain
          type="primary"
          size="mini"
          >Apply</el-button
        >
      </div>
    </el-collapse-transition>
  </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
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
        .map(days => {
          days = days - 1;
          return this.daysOfWeek[days].text;
        })
        .join(", ");
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapActions("Admin", ["createEvent", "getTemplates"]),
    applyTemplate(e) {
      e.stopPropagation();
      // Create an event as many times as there is on the template
      this.loading = true;
      this.createEvent(this.data.content)
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    shareTemplate(e) {
      e.stopPropagation();

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
        });
    },
    deleteTemplate(e) {
      e.stopPropagation();

      this.loading = true;
      this.request({
        method: "DELETE",
        url: "events/templates/delete",
        data: { id: this.data._id }
      })
        .then(response => {
          this.loading = false;

          this.$refs.templateContainer.remove();
          this.getTemplates();
          this.$emit("toggle", false);
        })
        .catch(err => {
          this.loading = false;
          this.loading = true;
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
strong {
  font-weight: bold;
}
.event_template_container {
  border: 1px solid #efefef;
  border-radius: 10px;
}
</style>
