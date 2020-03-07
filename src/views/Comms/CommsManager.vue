<template>
  <div class="comms_container">
    <CommsFilters />
    <CommsList />
    <CommsWindow />
  </div>
</template>

<script>
import CommsList from "./components/CommsList";
import CommsWindow from "./components/CommsWindow";
import CommsFilters from "./components/CommsFilters";
export default {
  name: "CommsManager",
  components: {
    CommsList,
    CommsWindow,
    CommsFilters
  }
};
</script>

<style lang="scss" scoped>
.comms_container {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
