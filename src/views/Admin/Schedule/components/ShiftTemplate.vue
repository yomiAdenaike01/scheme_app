<template>
  <el-card
    class="shift_template_wrapper mt-3"
    shadow="hover"
    v-loading="loading"
    ref="shiftTemplate"
  >
    <el-row type="flex" :gutter="40">
      <el-col class="basic_information">
        <header class="p-2">{{returnWeekRange}}</header>
        <section class="p-2">{{client.company_name}}</section>
      </el-col>
      <el-col class="name_container">
        <h4>Template Name</h4>
        <p class="capitalize">{{data.name}}</p>
      </el-col>
      <el-col>
        <div class="inner_container columns">
          <el-button type="primary" circle icon="el-icon-edit-outline" />
          <el-button
            type="danger"
            circle
            icon="el-icon-close"
            @click="$emit('deleteTemplate',{id:data._id,elem:$refs.shiftTemplate})"
          />
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import dates from "@/mixins/dates";
import moment from "moment";
import { mapState } from "vuex";
import Title from "@/components/Title";
export default {
  name: "Shift_Template",
  data() {
    return {
      selected: false,
      loading: false
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
    ...mapState(["client"]),

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

  components: {
    Title
  }
};
</script>

<style lang="scss" scoped>
.shift_template_wrapper {
  cursor: pointer;
}
.basic_information {
  border-radius: 10px;
}
header {
  background: lighten($color: #efefef, $amount: 2);
}
section {
  background: lighten($color: #efefef, $amount: 4);
}
</style>