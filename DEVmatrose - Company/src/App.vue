<template>
  <div class="amiga-system" :class="{ 'booted': systemBooted }">
    <!-- Boot sequence -->
    <div v-if="!systemBooted" class="boot-sequence">
      <!-- Amiga Boot Screen -->
      <div v-if="bootPhase === 'screen'" class="boot-screen-container">
        <img :src="`${basePath}screens/bootscreen.png`" alt="Amiga Boot Screen" class="boot-screen-image">
      </div>
      
      <!-- Boot Messages -->
      <div v-else class="boot-screen">
        <div class="floppy-animation">
          <div class="floppy-disk"></div>
          <div class="floppy-led" :class="{ 'led-active': diskReading }"></div>
        </div>
        <div class="boot-messages">
          <div v-for="(message, index) in bootMessages" :key="index"
               :class="{ 'visible': currentBootMessage >= index }">
            {{ message }}
          </div>
        </div>
      </div>
    </div>

    <!-- Workbench -->
    <!-- ... existierender Code ... -->
  </div>
</template>

<script>
export default {
  // ... existierender Code ...
  data() {
    return {
      systemBooted: false,
      diskReading: false,
      bootPhase: 'screen', // 'screen' oder 'messages'
      bootMessages: [
        'Commodore Amiga 500 - Kickstart 1.3',
        'ROM Version 34.5 (07 Dec 1991)',
        'DEVmatrose 2.0 (AmigaOS 2.0 compatible)',
        'CPU: MC68000 @ 7.16MHz',
        'Memory: 512K Chip RAM, 512K Fast RAM',
        'Loading Workbench...'
      ],
      currentBootMessage: 0,
      basePath: '',
      // ... weiterer existierender Code ...
    }
  },
  mounted() {
    this.basePath = import.meta.env.BASE_URL || '/';
    this.startBootSequence();
    this.updateClock();
    setInterval(this.updateClock, 1000);

    // Event listeners for clicking outside to close menus
    document.addEventListener('click', this.handleOutsideClick);
  },
  methods: {
    startBootSequence() {
      this.diskReading = true;
      
      // Erst den Bootscreen für 3 Sekunden anzeigen
      setTimeout(() => {
        this.bootPhase = 'messages';
        
        // Dann die Boot-Meldungen anzeigen
        const messageInterval = setInterval(() => {
          if (this.currentBootMessage < this.bootMessages.length - 1) {
            this.currentBootMessage++;
          } else {
            clearInterval(messageInterval);
            setTimeout(() => {
              this.systemBooted = true;
              this.playBootSound();
            }, 1500);
          }
        }, 800);
      }, 3000);
    },
    // ... weiterer existierender Code ...
  }
}
</script>

<style>
/* ... existierender CSS-Code ... */

/* Boot Screen Image Styling */
.boot-screen-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--boot-blue);
}

.boot-screen-image {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
}
</style>
