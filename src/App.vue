<template>
  <div class="amiga-system" :class="{ 'booted': systemBooted }">
    <!-- Boot sequence -->
    <div v-if="!systemBooted" class="boot-sequence">
      <div class="boot-screen">
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
    <div v-else class="workbench">
      <!-- Top menu bar -->
      <div class="topbar">
        <div class="workbench-icon" @click="toggleMenu('workbench')"></div>
        <div class="menu-items">
          <span @click="toggleMenu('workbench')">Workbench</span>
          <span @click="toggleMenu('disk')">Disk</span>
          <span @click="toggleMenu('system')">System</span>
          <span @click="toggleMenu('special')">Special</span>
        </div>
        <div class="memory-indicator">
          Chip: 512K  Fast: 512K  <span class="clock">{{ currentTime }}</span>
        </div>
      </div>

      <!-- Dropdown menus -->
      <div v-if="activeMenu" class="dropdown-menu" :class="activeMenu">
        <div class="menu-item" @click="toggleWindow('about')">About...</div>
        <div class="menu-item" @click="toggleWindow('skills')">Skills</div>
        <div class="menu-item" @click="toggleWindow('projects')">Projects</div>
        <div class="menu-item" @click="toggleWindow('contact')">Contact</div>
        <div class="menu-separator"></div>
        <div class="menu-item" @click="rebootSystem">Reboot</div>
      </div>

      <!-- Desktop -->
      <div class="desktop">
        <!-- Windows -->
        <div v-for="(win, name) in windows" :key="name"
             v-show="win.visible"
             class="window"
             :class="{ 'active': activeWindow === name, 'maximized': win.isMaximized }"
             :style="win.position">

          <div class="window-title" @mousedown="startDrag(name, $event)">
            <div class="title-icon" :class="name + '-icon'"></div>
            <span>{{ win.title }}</span>
            <div class="window-controls">
              <button @click="minimizeWindow(name)" class="depth-button"></button>
              <button @click="maximizeWindow(name)" class="zoom-button"></button>
              <button @click="closeWindow(name)" class="close-button"></button>
            </div>
          </div>

          <div class="window-content">
            <div class="title-bar blue-bar">{{ win.subtitle }}</div>
            <component :is="win.component" :data="win.data"></component>
          </div>
        </div>

        <!-- Games Window -->
        <games-window
          v-if="isGamesWindowOpen"
          @close="isGamesWindowOpen = false"
          @maximize="isGamesMaximized = !isGamesMaximized"
          :class="{ maximized: isGamesMaximized, active: activeWindow === 'games' }"
          @click="setActiveWindow('games')"
          :style="getWindowPosition('games')"
        ></games-window>

        <!-- Desktop icons -->
        <div class="desktop-icons">
          <div class="desktop-icon" @click="toggleWindow('about')">
            <div class="icon about-icon"></div>
            <span>About</span>
          </div>
          <div class="desktop-icon" @click="toggleWindow('skills')">
            <div class="icon skills-icon"></div>
            <span>Skills</span>
          </div>
          <div class="desktop-icon" @click="toggleWindow('projects')">
            <div class="icon projects-icon"></div>
            <span>Projects</span>
          </div>
          <div class="desktop-icon" @click="toggleWindow('terminal')">
            <div class="icon terminal-icon"></div>
            <span>Terminal</span>
          </div>
          <div class="desktop-icon" @click="toggleWindow('contact')">
            <div class="icon contact-icon"></div>
            <span>Contact</span>
          </div>
          <desktop-icon
            label="Games"
            icon-class="games-icon"
            @click="openGamesWindow"
          />
          <!-- Games Folder -->
          <folder-icon 
            label="Games" 
            @click="openGamesFolder"
          />
        </div>

        <!-- FloppyDisk animation -->
        <div class="disk-drive">
          <div class="disk-slot"></div>
          <div class="disk-led" :class="{ 'active': diskActivity }"></div>
        </div>
      </div>
    </div>

    <!-- Games Folder Window (shows as disk drawer when opened) -->
    <div v-if="isGamesFolderOpen && systemBooted" class="window folder-window"
         :class="{ active: activeWindow === 'games-folder' }"
         @click="setActiveWindow('games-folder')"
         :style="getWindowPosition('games-folder')">
      <div class="window-title" @mousedown="startDrag('games-folder', $event)">
        <div class="title-icon folder-icon-title"></div>
        <span>Games:</span>
        <div class="window-controls">
          <button class="depth-button"></button>
          <button class="zoom-button" @click="maximizeFolderWindow('games-folder')"></button>
          <button class="close-button" @click="isGamesFolderOpen = false"></button>
        </div>
      </div>
      <div class="window-content folder-content">
        <div class="title-bar blue-bar">Amiga Games</div>
        <div class="folder-grid">
          <div class="game-disk" v-for="game in gamesData" :key="game.id" @click="launchGame(game)">
            <div class="disk-icon">
              <div class="disk-label">{{ game.title.substring(0, 8) }}</div>
            </div>
            <span>{{ game.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AboutComponent from './components/AboutComponent.vue'
import SkillsComponent from './components/SkillsComponent.vue'
import ProjectsComponent from './components/ProjectsComponent.vue'
import ContactComponent from './components/ContactComponent.vue'
import TerminalComponent from './components/TerminalComponent.vue'
import GamesWindow from './components/GamesWindow.vue'
import FolderIcon from './components/FolderIcon.vue'
import { gamesData } from './assets/data/games.js'
import DesktopIcon from './components/DesktopIcon.vue'

export default {
  name: 'AmigaWorkbench',
  components: {
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    TerminalComponent,
    GamesWindow,
    FolderIcon,
    DesktopIcon
  },
  data() {
    return {
      systemBooted: false,
      diskReading: false,
      bootMessages: [
        'Commodore Amiga 500 - Kickstart 1.3',
        'ROM Version 34.5 (07 Dec 1991)',
        'DEVmatrose 2.0 (AmigaOS 2.0 compatible)',
        'CPU: MC68000 @ 7.16MHz',
        'Memory: 512K Chip RAM, 512K Fast RAM',
        'Loading Workbench...'
      ],
      currentBootMessage: 0,
      currentTime: '00:00:00',
      activeMenu: null,
      diskActivity: false,
      activeWindow: 'about',
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
        }
      },
      isDragging: false,
      currentDragWindow: null,
      offset: { x: 0, y: 0 },
      isGamesWindowOpen: false,
      isGamesMaximized: false,
      isGamesFolderOpen: false,
      isGamesFolderMaximized: false,
      gamesFolderPosition: { top: '50px', left: '100px', width: '400px', zIndex: 5 },
      gamesFolderPreviousPosition: null,
      gamesData: gamesData
    }
  },
  mounted() {
    this.startBootSequence();
    this.updateClock();
    setInterval(this.updateClock, 1000);

    // Event listeners for clicking outside to close menus
    document.addEventListener('click', this.handleOutsideClick);
  },
  created() {
    // Open about window by default after boot
    setTimeout(() => {
      if (this.systemBooted) {
        this.toggleWindow('about');
      }
    }, 2500);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
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
      this.activeMenu = null;
      this.diskReading = false;

      // Reset windows
      for (const winKey in this.windows) {
        this.windows[winKey].visible = false;
        this.windows[winKey].isMaximized = false;
        if (this.windows[winKey].previousPosition) {
          this.windows[winKey].position = this.windows[winKey].previousPosition;
          this.windows[winKey].previousPosition = null;
        }
      }

      setTimeout(() => {
        this.startBootSequence();
      }, 1000);
    },
    updateClock() {
      const now = new Date();
      this.currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    },
    toggleMenu(menuName) {
      if (this.activeMenu === menuName) {
        this.activeMenu = null;
      } else {
        this.activeMenu = menuName;
      }
    },
    handleOutsideClick(event) {
      // Close menu if clicking outside
      if (this.activeMenu && !event.target.closest('.menu-items') && !event.target.closest('.dropdown-menu')) {
        this.activeMenu = null;
      }
    },
    toggleWindow(name) {
      // Close active menu when opening a window
      this.activeMenu = null;

      // Show disk activity
      this.diskActivity = true;
      setTimeout(() => {
        this.diskActivity = false;
      }, 600);

      // If window is already visible, bring to front
      if (this.windows[name].visible) {
        this.setActiveWindow(name);
      } else {
        this.windows[name].visible = true;
        this.setActiveWindow(name);
      }

      // Play disk sound
      this.playDiskSound();
    },
    setActiveWindow(name) {
      this.activeWindow = name;

      // Set highest z-index for active window
      let maxZ = 10;
      for (const winKey in this.windows) {
        const winZ = parseInt(this.windows[winKey].position.zIndex) || 0;
        maxZ = Math.max(maxZ, winZ);
      }
      this.windows[name].position = {
        ...this.windows[name].position,
        zIndex: maxZ + 1
      };
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
        document.addEventListener('mousemove', this.drag);
        document.addEventListener('mouseup', this.stopDrag);
      }
    },
    drag(event) {
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
      document.removeEventListener('mousemove', this.drag);
      document.removeEventListener('mouseup', this.stopDrag);
    },
    closeWindow(windowName) {
      this.windows[windowName].visible = false;
      this.playCloseSound();
    },
    minimizeWindow(windowName) {
      // Just flash the window for fun
      const win = this.windows[windowName];
      win.position = { ...win.position, opacity: 0.5 };
      setTimeout(() => {
        win.position = { ...win.position, opacity: 1 };
      }, 200);
      this.playClickSound();
    },
    maximizeWindow(windowName) {
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
      this.playClickSound();
    },
    playBootSound() {
      // Could implement actual sound here with Audio API
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
    openGamesWindow() {
      this.isGamesWindowOpen = true;
      this.setActiveWindow('games');
    },
    openGamesFolder() {
      this.isGamesFolderOpen = true;
      this.setActiveWindow('games-folder');
      this.playDiskSound();
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
      }
      // Handle other windows
      return this.windows[windowName].position;
    },
    maximizeFolderWindow(windowName) {
      if (windowName === 'games-folder') {
        if (!this.isGamesFolderMaximized) {
          this.gamesFolderPreviousPosition = {...this.gamesFolderPosition};
          this.isGamesFolderMaximized = true;
        } else {
          this.gamesFolderPosition = this.gamesFolderPreviousPosition;
          this.isGamesFolderMaximized = false;
        }
        this.playClickSound();
      }
    }
  }
}
</script>

<style>
@import './assets/amiga-theme.css';

/* Zusätzliche Stile für den Spiele-Ordner */
.folder-window {
  min-width: 300px;
}

.folder-icon-title {
  background-color: var(--folder-yellow) !important;
}

.folder-icon-title:after {
  content: "G";
  position: absolute;
  top: 1px;
  left: 5px;
  color: var(--text-dark);
  font-weight: bold;
}

.folder-content {
  max-height: 500px;
  overflow-y: auto;
}

.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  padding: 15px;
}

.game-disk {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  text-align: center;
}

.disk-icon {
  width: 60px;
  height: 60px;
  background-color: #333;
  border: 2px solid #666;
  border-radius: 3px;
  position: relative;
  margin-bottom: 5px;
}

.disk-icon:before {
  content: "";
  position: absolute;
  width: 70%;
  height: 10px;
  background: #222;
  bottom: 10px;
  left: 15%;
}

.disk-label {
  position: absolute;
  top: 10px;
  width: 100%;
  color: white;
  font-size: 10px;
  text-align: center;
}

.game-disk span {
  background-color: var(--workbench-blue);
  color: var(--text-light);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 11px;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-disk:hover .disk-icon {
  transform: translateY(-2px);
  box-shadow: 0 3px 5px rgba(0,0,0,0.3);
}
</style>
