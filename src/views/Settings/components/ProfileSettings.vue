<template>
  <div>
    {{ currentUser }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ProfileSettings',
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>

<style></style>
