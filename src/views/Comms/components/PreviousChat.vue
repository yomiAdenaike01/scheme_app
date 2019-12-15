<template>
  <div
    class="previous_chat"
    @click="$emit('chatData',{id:transcriptData._id,reciever:transcriptData.user_2})"
  >
    <span>{{transcriptData}}</span>
  </div>
</template>

<script>
export default {
  name: "PreviousChat",
  props: {
    transcriptData: Object
  }
};
</script>

<style>
</style>