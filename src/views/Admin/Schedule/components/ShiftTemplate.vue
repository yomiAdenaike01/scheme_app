<template>
  <div class="shift_template_wrapper">
    <el-collapse-transition>
      <div class="template_details" @click="toggleTemplate">
        <strong class="template_name">{{ data.name }}</strong>
        <p>Timesheet date range: {{ returnWeekRange }}</p>
        <p class="date_created">
          {{ format(data.date_created, "DD/MM/YYYY") }}
        </p>
        <transition name="el-fade-in">
          <el-button
            class="indicator"
            icon="el-icon-check"
            type="success"
            circle
            size="small"
            v-if="selected"
          ></el-button>
        </transition>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import dates from "@/mixins/dates";
import moment from "moment";
export default {
  name: "Shift_Template",
  data() {
    return {
      selected: false
    };
  },

  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mixins: [dates],
  computed: {
    returnWeekRange() {
      let startDate = this.data.content[0].startDate;
      let endDate = this.data.content[0].endDate;
      let momentStartDate = moment(moment(startDate).startOf("week")).format(
        "DD/MM/YYYY"
      );
      let momentEndDate = moment(moment(endDate).endOf("week")).format(
        "DD/MM/YYYY"
      );
      return `${momentStartDate} - ${momentEndDate}`;
    }
  },
  methods: {
    toggleTemplate() {
      if (!this.selected) {
        this.selected = true;
        this.$emit("selectedTemplate", this.data);
      } else {
        this.selected = false;
        this.$emit("selectedTemplate", {});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.shift_template_wrapper {
  background: rgb(250, 250, 250);
  border-radius: 10px;
  padding: 1em;
}
.template_name {
  letter-spacing: 1.2px;
}
strong,
p,
span {
  margin: 0;
  padding: 0;
}
.date_created {
  font-size: 0.8em;
}
.template_details {
  position: relative;
}
.indicator {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
