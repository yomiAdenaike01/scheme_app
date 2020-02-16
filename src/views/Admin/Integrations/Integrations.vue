<template> </template>

<script>
export default {
  name: "Integrations",
  computed:{
      integrations(){
          return [
              {
                  name:'gcal',
                  condition:"gcalToken" in this.userInformation,
                  click:
              },
              {

              }
          ]
      },
  }
};
</script>

<style></style>
