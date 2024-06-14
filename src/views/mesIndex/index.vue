<template>
  <div class="mesIndex-container">
    <div class="mesIndex-text">{{  ''}}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MesIndex',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.mesIndex {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
