<template>
  <div class="boot-sequence">
    <div class="boot-screen">
      <div class="floppy-animation">
        <div class="floppy-disk"></div>
        <div class="floppy-led" :class="{ 'led-active': systemStore.diskReading }"></div>
      </div>
      <div class="boot-messages">
        <div v-for="(message, index) in systemStore.bootMessages" :key="index"
             :class="{ 'visible': systemStore.currentBootMessage >= index }">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSystemStore } from '../stores/systemStore';

export default {
  name: 'BootSequence',
  setup() {
    const systemStore = useSystemStore();
    return { systemStore };
  }
}
</script>
