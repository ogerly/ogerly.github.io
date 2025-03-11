<template>
  <div class="amiga-system" :class="{ 'booted': systemStore.systemBooted }">
    <!-- Boot sequence -->
    <div v-if="!systemStore.systemBooted" class="boot-sequence">
      <boot-sequence />
    </div>

    <!-- Workbench -->
    <div v-else class="workbench">
      <!-- Top menu bar -->
      <workbench-menu-bar />

      <!-- Desktop -->
      <div class="desktop">
        <!-- Standard windows using WindowComponent -->
        <window-component
          v-for="(window, name) in windowStore.windows"
          v-show="window.visible"
          :key="name"
          :windowId="name"
          :title="window.title"
          :subtitle="window.subtitle"
          :iconClass="`${name}-icon`"
          :theme="getWindowTheme(name)"
          :position="window.position"
          :isActive="windowStore.activeWindow === name"
          @activate="windowStore.setActiveWindow(name)"
          @close="windowStore.handleWindowClose(name)"
          @minimize="windowStore.handleWindowMinimize(name)"
          @maximize="(newPosition) => windowStore.handleWindowMaximize(name, newPosition)"
          @update:position="(newPos) => windowStore.updateWindowPosition(name, newPos)"
          @drag="() => windowStore.handleWindowDrag(name)"
        >
          <!-- Dynamically load component based on window.component -->
          <component 
            :is="window.component" 
            :data="window.data"
          />
        </window-component>
        
        <!-- Games Window using WindowComponent -->
        <window-component
          v-if="windowStore.isGamesWindowOpen"
          windowId="games"
          title="Amiga Games"
          subtitle="Emulated Games"
          theme="game"
          :position="windowStore.getWindowPosition('games')"
          :isActive="windowStore.activeWindow === 'games'"
          @activate="windowStore.setActiveWindow('games')"
          @close="windowStore.handleWindowClose('games')"
          @minimize="windowStore.handleWindowMinimize('games')"
          @maximize="(newPos) => windowStore.handleWindowMaximize('games', newPos)"
          @update:position="(newPos) => windowStore.updateWindowPosition('games', newPos)"
          @drag="() => windowStore.handleWindowDrag('games')"
        >
          <games-window-content :selectedGame="windowStore.selectedGame" />
        </window-component>

        <!-- Games Folder Window using WindowComponent -->
        <window-component
          v-if="windowStore.isGamesFolderOpen"
          windowId="games-folder"
          title="Games:"
          subtitle="Amiga Games"
          theme="folder"
          :position="windowStore.getWindowPosition('games-folder')"
          :isActive="windowStore.activeWindow === 'games-folder'"
          @activate="windowStore.setActiveWindow('games-folder')"
          @close="windowStore.handleWindowClose('games-folder')"
          @minimize="windowStore.handleWindowMinimize('games-folder')"
          @maximize="(newPos) => windowStore.handleWindowMaximize('games-folder', newPos)"
          @update:position="(newPos) => windowStore.updateWindowPosition('games-folder', newPos)"
          @drag="() => windowStore.handleWindowDrag('games-folder')"
        >
          <div class="folder-grid">
            <div class="game-disk" 
               v-for="game in gamesData" 
               :key="game.id" 
               @click="launchGame(game)">
              <div class="disk-icon">
                <div class="disk-label">{{ game.title.substring(0, 8) }}</div>
              </div>
              <span>{{ game.title }}</span>
            </div>
          </div>
        </window-component>

        <!-- Blog Folder Window (already using WindowComponent) -->
        <window-component
          v-if="windowStore.isBlogFolderOpen"
          windowId="blog-folder"
          title="Blog Posts:"
          subtitle="Im Sumpf Blog Posts"
          theme="blog"
          :isActive="windowStore.activeWindow === 'blog-folder'"
          :position="windowStore.blogFolderPosition"
          @activate="windowStore.setActiveWindow('blog-folder')"
          @close="windowStore.handleWindowClose('blog-folder')"
          @minimize="windowStore.handleWindowMinimize('blog-folder')"
          @maximize="(newPos) => windowStore.handleWindowMaximize('blog-folder', newPos)"
          @update:position="(newPos) => windowStore.updateWindowPosition('blog-folder', newPos)"
          @drag="() => windowStore.handleWindowDrag('blog-folder')">
          
          <!-- Blog post list content -->
          <div class="blog-posts-grid">
            <div v-if="blogStore.loading" class="posts-loading">
              <div class="blog-progress-bar">
                <div :style="{ width: blogStore.loadingProgress + '%' }" class="blog-progress"></div>
              </div>
              <p>Lade Blog-Einträge...</p>
            </div>
            <div v-else-if="blogStore.error" class="posts-error">
              <p>Fehler beim Laden: {{ blogStore.error }}</p>
            </div>
            <div v-else-if="blogStore.blogData.posts.length === 0" class="posts-empty">
              <p>Keine Blog-Einträge gefunden</p>
            </div>
            <div v-else class="blog-post-items">
              <div v-for="(post, index) in blogStore.blogData.posts" 
                  :key="index" 
                  class="blog-post-item"
                  @click="openBlogPost(post.link)">
                <div class="blog-file-icon"></div>
                <div class="blog-post-info">
                  <div class="blog-post-title">{{ post.title }}</div>
                  <div class="blog-post-date">{{ post.pubDate }}</div>
                </div>
              </div>
            </div>
          </div>
        </window-component>
        
        <!-- Additional Blog Folder Window (already using WindowComponent) -->
        <window-component
          v-if="windowStore.isAdditionalBlogFolderOpen"
          windowId="additional-blog-folder"
          title="Blog:"
          subtitle="Im Sumpf Blog"
          theme="blog"
          :isActive="windowStore.activeWindow === 'additional-blog-folder'"
          :position="windowStore.additionalBlogFolderPosition"
          @activate="windowStore.setActiveWindow('additional-blog-folder')"
          @close="windowStore.handleWindowClose('additional-blog-folder')"
          @minimize="windowStore.handleWindowMinimize('additional-blog-folder')"
          @maximize="(newPos) => windowStore.handleWindowMaximize('additional-blog-folder', newPos)"
          @update:position="(newPos) => windowStore.updateWindowPosition('additional-blog-folder', newPos)"
          @drag="() => windowStore.handleWindowDrag('additional-blog-folder')">
          
          <!-- Blog folder content -->
          <div class="blog-folder-content">
            <div class="blog-folder-item" @click="openBlogWebsite">
              <div class="folder-item-icon website-icon"></div>
              <span>Blog Website</span>
            </div>
            
            <div class="blog-folder-item" @click="windowStore.toggleWindow('blog')">
              <div class="folder-item-icon reader-icon"></div>
              <span>Blog Reader</span>
            </div>
            
            <div class="blog-folder-separator"></div>
            
            <div class="blog-folder-categories">
              <h3>Blog Kategorien</h3>
              <div class="categories-list">
                <div class="category-item" @click="openBlogWebsite">
                  <span>Technologie</span>
                </div>
                <div class="category-item" @click="openBlogWebsite">
                  <span>Programmierung</span>
                </div>
                <div class="category-item" @click="openBlogWebsite">
                  <span>Blockchain</span>
                </div>
                <div class="category-item" @click="openBlogWebsite">
                  <span>Web Development</span>
                </div>
              </div>
            </div>
          </div>
        </window-component>

        <!-- Desktop icons -->
        <div class="desktop-icons">
          <div class="desktop-icon" @click="windowStore.toggleWindow('about')">
            <div class="icon about-icon"></div>
            <span>About</span>
          </div>
          <div class="desktop-icon" @click="windowStore.toggleWindow('skills')">
            <div class="icon skills-icon"></div>
            <span>Skills</span>
          </div>
          <div class="desktop-icon" @click="windowStore.toggleWindow('projects')">
            <div class="icon projects-icon"></div>
            <span>Projects</span>
          </div>
          <div class="desktop-icon" @click="windowStore.toggleWindow('terminal')">
            <div class="icon terminal-icon"></div>
            <span>Terminal</span>
          </div>
          <div class="desktop-icon" @click="windowStore.toggleWindow('contact')">
            <div class="icon contact-icon"></div>
            <span>Contact</span>
          </div>
          <folder-icon 
            label="Games" 
            type="games"
            @click="windowStore.openGamesFolder"
          />
          <div class="desktop-icon" @click="windowStore.toggleWindow('nostr')">
            <div class="icon nostr-icon"></div>
            <span>NostrOS</span>
          </div>
          <!-- Blog als Icon -->
          <div class="desktop-icon" @click="windowStore.toggleWindow('blog')">
            <div class="icon blog-icon"></div>
            <span>Im Sumpf</span>
          </div>
          <!-- Zwei Blog-Ordner mit unterschiedlichen Namen -->
          <folder-icon 
            label="Blog Posts" 
            type="blog"
            @click="windowStore.openBlogFolder"
          />
          <folder-icon 
            label="Blog" 
            type="blog"
            @click="windowStore.openAdditionalBlogFolder"
          />
          <div class="desktop-icon" @click="windowStore.toggleWindow('vrar')">
            <div class="icon vrar-icon"></div>
            <span>VR/AR</span>
          </div>
        </div>

        <!-- FloppyDisk animation -->
        <div class="disk-drive">
          <div class="disk-slot"></div>
          <div class="disk-led" :class="{ 'active': systemStore.diskActivity }"></div>
        </div>
        
        <!-- Hintergrund-Inhalt (z-index niedriger als Icons) -->
        <div class="desktop-background">
          <blog-preview />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue';
import { useSystemStore } from './stores/systemStore';
import { useWindowStore } from './stores/windowStore';
import { useMenuStore } from './stores/menuStore';
import { useBlogStore } from './stores/blogStore';
import { useGamesFolderMixin } from './mixins/gamesFolderMixin';
import { useBlogFolderMixin } from './mixins/blogFolderMixin';

// Components
import BootSequence from './components/BootSequence.vue';
import WorkbenchMenuBar from './components/WorkbenchMenuBar.vue';
import BlogPreview from './components/BlogPreview.vue';
import WindowComponent from './components/WindowComponent.vue';

// Window content components
import AboutComponent from './components/AboutComponent.vue';
import SkillsComponent from './components/SkillsComponent.vue';
import ProjectsComponent from './components/ProjectsComponent.vue';
import ContactComponent from './components/ContactComponent.vue';
import TerminalComponent from './components/TerminalComponent.vue';
import GamesWindowContent from './components/GamesWindowContent.vue';
import NostrWindow from './components/NostrWindow.vue';
import BlogWindow from './components/BlogWindow.vue';
import FolderIcon from './components/FolderIcon.vue';
import VRWindow from './components/VRWindow.vue';
import { gamesData } from './assets/data/games.js';

export default {
  name: 'AmigaWorkbench',
  components: {
    BootSequence,
    WorkbenchMenuBar,
    BlogPreview,
    WindowComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    TerminalComponent,
    GamesWindowContent,
    NostrWindow,
    BlogWindow,
    FolderIcon,
    VRWindow
  },
  setup() {
    const systemStore = useSystemStore();
    const windowStore = useWindowStore();
    const menuStore = useMenuStore();
    const blogStore = useBlogStore();
    
    // Clock updater
    let clockTimer = null;
    
    // Games-Ordner-Funktionen - keep only what's necessary
    const { 
      launchGame,
      gamesData
    } = useGamesFolderMixin();
    
    // Blog-Ordner-Funktionen - keep only what's necessary
    const {
      openBlogPost,
      openBlogWebsite
    } = useBlogFolderMixin();
    
    // Window Helper functions
    const getWindowTheme = (name) => {
      const themeMap = {
        terminal: 'terminal',
        blog: 'blog',
        nostr: 'terminal',
        default: 'default'
      };
      
      return themeMap[name] || 'default';
    };
    
    // Setup code
    onMounted(() => {
      // Start boot sequence
      systemStore.startBootSequence();
      
      // Update clock every second
      systemStore.updateClock();
      clockTimer = setInterval(systemStore.updateClock, 1000);
      
      // Event listeners for clicking outside to close menus
      document.addEventListener('click', menuStore.handleOutsideClick);
    });
    
    onBeforeUnmount(() => {
      clearInterval(clockTimer);
      document.removeEventListener('click', menuStore.handleOutsideClick);
    });
    
    return {
      systemStore,
      windowStore,
      blogStore,
      gamesData,
      launchGame,
      openBlogPost,
      openBlogWebsite,
      getWindowTheme
    };
  }
}
</script>

<style>
/* Zusätzlicher Stil für den Hintergrundinhalt */
.desktop-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0; /* Niedrigerer z-Index als Icons */
  padding-top: 40px; /* Platz für die Menüleiste */
}

/* Wichtig: Desktop-Icons müssen über dem Hintergrund sein */
.desktop-icons {
  z-index: 2;
  pointer-events: auto;
}

/* Fenster müssen den höchsten z-index haben */
.window {
  z-index: 5;
}

/* Stelle sicher, dass alle Icons klickbar sind */
.desktop-icon, 
.folder-icon {
  pointer-events: auto;
}

/* Add VR/AR icon style */
.vrar-icon:after {
  content: "VR";
  position: absolute;
  top: 1px;
  left: 3px;
  color: #00ccff;
  font-weight: bold;
}
</style>