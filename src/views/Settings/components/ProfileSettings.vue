<template>
  <div>
    {{ currentUser }}
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ProfileSettings',
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {}
}
</script>

<style></style>
