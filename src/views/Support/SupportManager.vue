<template>
  <div class="support_centre">
    <p>Support Centre</p>
    <div class="support_units_container">
      <SupportDashboardItem
        v-for="(supportUnitData, index) in supportUnits"
        :key="index"
        :supportData="supportUnitData"
      />
    </div>
  </div>
</template>

<script>
import SupportDashboardItem from "./components/SupportDashboardItem";
export default {
  name: "SupportCentre",
  computed: {
    supportUnits() {
      return [
        {
          name: "Report bug/ request feature",
          click: () => {
            alert("request feature");
          }
        }
      ];
    }
  },
  components: {
    SupportDashboardItem
  }
};
</script>

<style lang="scss" scoped>
.support_units_container {
  flex: 0 0 1;
  justify-content: center;
  align-items: center;
}
</style>
