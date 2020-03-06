<template>
  <div class="integrations_container">
    <h1>Integrations</h1>
  </div>
</template>

<script>
export default {
  name: "Integrations",
  computed: {
    integrations() {
      return [
        {
          name: "gcal",
          condition: "gcalToken" in this.userInformation,
          img: "" // ionc
        },
        {}
      ];
    }
  }
};
</script>

<style></style>
