<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Comms',
  created() {
    this.getTranscripts()
  },
  methods: {
    ...mapActions('Comms', ['getTranscripts'])
  }
}
</script>

<style></style>
