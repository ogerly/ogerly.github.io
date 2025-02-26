import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', {
  state: () => ({
    systemBooted: false,
    bootMessages: [
      'Commodore Amiga 500 - Kickstart 1.3',
      'ROM Version 34.5 (07 Dec 1991)',
      'DEVmatrose 2.0 (AmigaOS 2.0 compatible)',
      'CPU: MC68000 @ 7.16MHz',
      'Memory: 512K Chip RAM, 512K Fast RAM',
      'Loading Workbench...'
    ],
    currentBootMessage: 0,
    diskReading: false,
    diskActivity: false,
    currentTime: '00:00:00',
  }),
  
  actions: {
    startBootSequence() {
      this.diskReading = true;
      
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
    },
    
    rebootSystem() {
      this.systemBooted = false;
      this.currentBootMessage = 0;
      this.diskReading = false;
      
      // Nach einer Verzögerung neu starten
      setTimeout(() => {
        this.startBootSequence();
      }, 1000);
    },
    
    updateClock() {
      const now = new Date();
      this.currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    },
    
    showDiskActivity() {
      this.diskActivity = true;
      setTimeout(() => {
        this.diskActivity = false;
      }, 600);
    },
    
    playBootSound() {
      console.log('Boot sound played');
    },
    
    playDiskSound() {
      console.log('Disk sound played');
    },
    
    playClickSound() {
      console.log('Click sound played');
    },
    
    playCloseSound() {
      console.log('Close sound played');
    },
  }
});
