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
        </div>

        <!-- FloppyDisk animation -->
        <div class="disk-drive">
          <div class="disk-slot"></div>
          <div class="disk-led" :class="{ 'active': diskActivity }"></div>
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

export default {
  name: 'AmigaWorkbench',
  components: {
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    TerminalComponent
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
      offset: { x: 0, y: 0 }
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
    }
  }
}
</script>

<style>
@import './assets/amiga-theme.css';
</style>
