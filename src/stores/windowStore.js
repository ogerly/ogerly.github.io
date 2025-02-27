import { defineStore } from 'pinia';
import { useSystemStore } from './systemStore';

export const useWindowStore = defineStore('window', {
  state: () => ({
    activeWindow: 'about',
    isDragging: false,
    currentDragWindow: null,
    offset: { x: 0, y: 0 },
    isGamesWindowOpen: false,
    isGamesMaximized: false,
    isGamesFolderOpen: false,
    isGamesFolderMaximized: false,
    gamesFolderPosition: { top: '50px', left: '100px', width: '400px', zIndex: 5 },
    gamesFolderPreviousPosition: null,
    selectedGame: null,
    isBlogFolderOpen: false,
    isBlogFolderMaximized: false,
    blogFolderPosition: { top: '50px', left: '250px', width: '400px', zIndex: 5 },
    blogFolderPreviousPosition: null,
    isAdditionalBlogFolderOpen: false,
    isAdditionalBlogFolderMaximized: false,
    additionalBlogFolderPosition: { top: '70px', left: '300px', width: '450px', zIndex: 5 },
    additionalBlogFolderPreviousPosition: null,
    windows: {
      about: {
        visible: true,
        title: 'About.info',
        subtitle: 'Alexander Friedland (@ogerly)',
        position: { top: '40px', left: '80px', width: '520px', zIndex: 10 },
        isMaximized: false,
        previousPosition: null,
        component: 'AboutComponent',
        data: {
          title: 'Hallo, ich bin Alexander Friedland',
          subtitle: 'Entwickler, Innovator und Technologie-Enthusiast',
          content: 'Seit 1999 tauche ich in die Welt der Softwareentwicklung ein, und mit über 25 Jahren Erfahrung habe ich mich als Web- und Softwareentwickler etabliert, der immer am Puls der Zeit bleibt. Ich bin der Gründer von DEVmatrose, meinem Unternehmen, das sich auf maßgeschneiderte Softwarelösungen spezialisiert hat – mit einem besonderen Fokus auf innovative und dezentrale Technologien. Ich komme aus Dresden, Deutschland, aber meine Arbeit ist grenzenlos, denn ich denke und handle gerne global.'
        }
      },
      skills: {
        visible: false,
        title: 'Skills.info',
        subtitle: 'Tech Stack & Expertise',
        position: { top: '60px', left: '120px', width: '480px', zIndex: 5 },
        isMaximized: false,
        previousPosition: null,
        component: 'SkillsComponent',
        data: {
          skills: [
            { name: 'Frontend', items: ['JavaScript', 'Vue.js', 'Nuxt', 'Vuetify'] },
            { name: 'Backend', items: ['Node.js', 'Python', 'PHP', 'MySQL', 'Neo4J'] },
            { name: 'KI', items: ['Prompt Engineering', 'GPT-Modelle', 'Automatisierung'] },
            { name: 'Blockchain', items: ['Bitcoin', 'Ethereum', 'Polkadot', 'Nostr'] }
          ]
        }
      },
      projects: {
        visible: false,
        title: 'Projects.info',
        subtitle: 'Meine Projekte',
        position: { top: '80px', left: '160px', width: '500px', zIndex: 5 },
        isMaximized: false,
        previousPosition: null,
        component: 'ProjectsComponent',
        data: {
          projects: [
            { name: 'DEVmatrose Website', desc: 'Amiga Retro Design' },
            { name: 'IPFS Integration', desc: 'Dezentrale Daten' },
            { name: 'Nostr Client', desc: 'Dezentrales Social Network' }
          ]
        }
      },
      contact: {
        visible: false,
        title: 'Contact.info',
        subtitle: 'Kontaktieren Sie mich',
        position: { top: '100px', left: '200px', width: '400px', zIndex: 5 },
        isMaximized: false,
        previousPosition: null,
        component: 'ContactComponent',
        data: {
          links: [
            { name: 'Blog', url: 'https://imsumpf.blogspot.com' },
            { name: 'GitHub', url: 'https://github.com/ogerly' }
          ]
        }
      },
      terminal: {
        visible: false,
        title: 'AmigaShell',
        subtitle: 'CLI - Command Line Interface',
        position: { top: '50px', left: '150px', width: '600px', zIndex: 5 },
        isMaximized: false,
        previousPosition: null,
        component: 'TerminalComponent',
        data: {
          welcomeText: '1> Welcome to AmigaDOS\n1> Type "help" for commands\n'
        }
      },
      nostr: {
        visible: false,
        title: 'NostrOS 1.3',
        subtitle: 'Decentralized Social Network',
        position: { top: '30px', left: '220px', width: '600px', height: '500px', zIndex: 5 },
        isMaximized: false,
        previousPosition: null,
        component: 'NostrWindow',
        data: {}
      },
      blog: {
        visible: false,
        title: 'Im Sumpf Blog',
        subtitle: 'Alexander\'s Blog',
        position: { top: '50px', left: '100px', width: '650px', height: '500px', zIndex: 5 },
        isMaximized: false,
        previousPosition: null,
        component: 'BlogWindow',
        data: {}
      }
    }
  }),
  
  actions: {
    toggleWindow(name) {
      const systemStore = useSystemStore();
      
      // Show disk activity
      systemStore.showDiskActivity();

      // If window is already visible, bring to front
      if (this.windows[name].visible) {
        this.setActiveWindow(name);
      } else {
        this.windows[name].visible = true;
        this.setActiveWindow(name);
      }

      // Sound-Effekt
      systemStore.playDiskSound();
    },
    
    closeWindow(windowName) {
      this.windows[windowName].visible = false;
      const systemStore = useSystemStore();
      systemStore.playCloseSound();
    },
    
    setActiveWindow(name) {
      this.activeWindow = name;

      // Set highest z-index for active window
      let maxZ = 10;
      for (const winKey in this.windows) {
        const winZ = parseInt(this.windows[winKey].position.zIndex) || 0;
        maxZ = Math.max(maxZ, winZ);
      }
      
      if (this.windows[name]) {
        this.windows[name].position = {
          ...this.windows[name].position,
          zIndex: maxZ + 1
        };
      }
    },
    
    startDrag(windowName, event) {
      // Set as active window
      this.setActiveWindow(windowName);

      // Start drag if not maximized
      if (!this.windows[windowName].isMaximized) {
        this.isDragging = true;
        this.currentDragWindow = windowName;
        const rect = event.target.getBoundingClientRect();
        this.offset = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.stopDrag);
      }
    },
    
    handleDrag(event) {
      if (this.isDragging && this.currentDragWindow) {
        this.windows[this.currentDragWindow].position = {
          ...this.windows[this.currentDragWindow].position,
          top: `${event.clientY - this.offset.y}px`,
          left: `${event.clientX - this.offset.x}px`
        };
      }
    },
    
    stopDrag() {
      this.isDragging = false;
      document.removeEventListener('mousemove', this.handleDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    },
    
    minimizeWindow(windowName) {
      const systemStore = useSystemStore();
      
      // Just flash the window for fun
      const win = this.windows[windowName];
      win.position = { ...win.position, opacity: 0.5 };
      setTimeout(() => {
        win.position = { ...win.position, opacity: 1 };
      }, 200);
      
      systemStore.playClickSound();
    },
    
    maximizeWindow(windowName) {
      const systemStore = useSystemStore();
      
      const win = this.windows[windowName];
      if (!win.isMaximized) {
        win.previousPosition = { ...win.position };
        win.position = {
          top: '20px',
          left: '0',
          width: 'calc(100% - 4px)',
          height: 'calc(100vh - 24px)',
          zIndex: win.position.zIndex
        };
        win.isMaximized = true;
      } else {
        win.position = win.previousPosition;
        win.isMaximized = false;
      }
      
      systemStore.playClickSound();
    },
    
    // Game-Folder spezifische Methoden
    openGamesFolder() {
      this.isGamesFolderOpen = true;
      this.setActiveWindow('games-folder');
      const systemStore = useSystemStore();
      systemStore.playDiskSound();
    },
    
    openGamesWindow() {
      this.isGamesWindowOpen = true;
      this.setActiveWindow('games');
    },
    
    launchGame(game) {
      this.selectedGame = game;
      this.isGamesFolderOpen = false;
      this.openGamesWindow();
    },
    
    getWindowPosition(windowName) {
      if (windowName === 'games-folder') {
        if (this.isGamesFolderMaximized) {
          return {
            top: '20px',
            left: '0',
            width: 'calc(100% - 4px)',
            height: 'calc(100vh - 24px)',
            zIndex: this.gamesFolderPosition.zIndex
          };
        } else {
          return this.gamesFolderPosition;
        }
      } else if (windowName === 'blog-folder') {
        if (this.isBlogFolderMaximized) {
          return {
            top: '20px',
            left: '0',
            width: 'calc(100% - 4px)',
            height: 'calc(100vh - 24px)',
            zIndex: this.blogFolderPosition.zIndex
          };
        } else {
          return this.blogFolderPosition;
        }
      } else if (windowName === 'additional-blog-folder') {
        if (this.isAdditionalBlogFolderMaximized) {
          return {
            top: '20px',
            left: '0',
            width: 'calc(100% - 4px)',
            height: 'calc(100vh - 24px)',
            zIndex: this.additionalBlogFolderPosition.zIndex
          };
        } else {
          return this.additionalBlogFolderPosition;
        }
      }
      // Handle other windows
      return this.windows[windowName]?.position;
    },
    
    maximizeFolderWindow(windowName) {
      const systemStore = useSystemStore();
      
      if (windowName === 'games-folder') {
        if (!this.isGamesFolderMaximized) {
          this.gamesFolderPreviousPosition = {...this.gamesFolderPosition};
          this.isGamesFolderMaximized = true;
        } else {
          this.gamesFolderPosition = this.gamesFolderPreviousPosition;
          this.isGamesFolderMaximized = false;
        }
        systemStore.playClickSound();
      }
    },
    
    openBlogFolder() {
      console.log('Blog-Ordner wird geöffnet...');
      this.isBlogFolderOpen = true;
      this.setActiveWindow('blog-folder');
      const systemStore = useSystemStore();
      systemStore.playDiskSound();
      systemStore.showDiskActivity();
    },
    
    openAdditionalBlogFolder() {
      console.log('Zusätzlicher Blog-Ordner wird geöffnet...');
      this.isAdditionalBlogFolderOpen = true;
      this.setActiveWindow('additional-blog-folder');
      const systemStore = useSystemStore();
      systemStore.playDiskSound();
      systemStore.showDiskActivity();
    },
    
    resetAllWindows() {
      for (const winKey in this.windows) {
        this.windows[winKey].visible = false;
        this.windows[winKey].isMaximized = false;
        if (this.windows[winKey].previousPosition) {
          this.windows[winKey].position = this.windows[winKey].previousPosition;
          this.windows[winKey].previousPosition = null;
        }
      }
      this.isGamesWindowOpen = false;
      this.isGamesMaximized = false;
      this.isGamesFolderOpen = false;
      this.isGamesFolderMaximized = false;
      this.selectedGame = null;
    }
  }
});
