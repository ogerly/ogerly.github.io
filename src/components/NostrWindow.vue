<template>
  <div class="nostr-window">
    <NostrAmigaClientSimple />
  </div>
</template>

<script>
import NostrAmigaClientSimple from './NostrAmigaClientSimple.vue';

export default {
  name: 'NostrWindow',
  components: {
    NostrAmigaClientSimple
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
.nostr-window {
  height: 100%;
  overflow: hidden;
}
</style>
