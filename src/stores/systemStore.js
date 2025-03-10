import { defineStore } from 'pinia';
import { useBlogStore } from './blogStore';

export const useSystemStore = defineStore('system', {
  state: () => ({
    systemBooted: false,
    bootMessages: [
      'DEVmatrose Kickstart 3.1, 40.68',
      'Copyright © 1999-2023 Alexander Friedland',
      'DEVmatrose Release 2.0',
      'Exec 40.10 (7 Jul 2023)',
      'Initializing System...', 
      'MC68000 CPU detected at 7.14MHz',
      'RAM: 1024K Chip RAM, 1MB Fast RAM',
      'Loading Libraries...',
      'Mounting file systems...',
      'Mounting DF0: DEVmatrose',
      'Mounting DH0: Development',
      'Initializing Network Services...',
      'Connecting to RSS Feed...',
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
      
      // Start preloading RSS feed silently during boot
      this.preloadRssFeed();
      
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
    
    // Add preloadRssFeed function to load blog data during boot
    async preloadRssFeed() {
      const blogStore = useBlogStore();
      
      try {
        // Check if there's cached data
        if (blogStore.isCacheValid && blogStore.blogData.posts.length > 0) {
          console.log('Using cached RSS feed data');
          return;
        }
        
        // Start loading the feed - silently in background
        console.log('Preloading RSS feed during boot sequence');
        await blogStore.loadBlogData();
      } catch (error) {
        console.error('Failed to preload RSS feed:', error);
      }
    },
    
    // Trigger disk activity for RSS feed updates
    refreshRssFeed() {
      this.showDiskActivity();
      
      const blogStore = useBlogStore();
      blogStore.loadBlogData(true); // Force refresh
    },
  }
});
