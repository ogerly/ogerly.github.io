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
        <!-- Windows --> 
        <workbench-window 
          v-for="(window, name) in windowStore.windows"
          v-show="window.visible"
          :key="name"
          :windowName="name"
          @click="windowStore.setActiveWindow(name)"
        />
        
        <!-- Games Window -->
        <games-window
          v-if="windowStore.isGamesWindowOpen"
          @close="windowStore.isGamesWindowOpen = false"
          @maximize="windowStore.isGamesMaximized = !windowStore.isGamesMaximized"
          :class="{ maximized: windowStore.isGamesMaximized, active: windowStore.activeWindow === 'games' }"
          @click="windowStore.setActiveWindow('games')"
          :style="windowStore.getWindowPosition('games')"
        ></games-window>

        <!-- Desktop icons (wichtig - muss einen höheren z-index als desktop-background haben) -->
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
        
        <!-- Games Folder Window -->
        <div v-if="windowStore.isGamesFolderOpen" class="window folder-window"
             :class="{ active: windowStore.activeWindow === 'games-folder' }"
             @click="windowStore.setActiveWindow('games-folder')"
             :style="windowStore.getWindowPosition('games-folder')">
          <div class="window-title" @mousedown="startDragGamesFolder">
            <div class="title-icon folder-icon-title"></div>
            <span>Games:</span>
            <div class="window-controls">
              <button class="depth-button"></button>
              <button class="zoom-button" @click="maximizeGamesFolder"></button>
              <button class="close-button" @click="closeGamesFolder"></button>
            </div>
          </div>
          <div class="window-content folder-content">
            <div class="title-bar blue-bar">Amiga Games</div>
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
          </div>
        </div>

        <!-- Blog Folder Window -->
        <div v-if="windowStore.isBlogFolderOpen" class="window folder-window"
             :class="{ active: windowStore.activeWindow === 'blog-folder' }"
             @click="windowStore.setActiveWindow('blog-folder')"
             :style="windowStore.getWindowPosition('blog-folder')">
          <div class="window-title" @mousedown="startDragBlogFolder">
            <div class="title-icon blog-icon-title"></div>
            <span>Blog Posts:</span>
            <div class="window-controls">
              <button class="depth-button"></button>
              <button class="zoom-button" @click="maximizeBlogFolder"></button>
              <button class="close-button" @click="closeBlogFolder"></button>
            </div>
          </div>
          <div class="window-content folder-content">
            <div class="title-bar blue-bar">Im Sumpf Blog Posts</div>
            
            <!-- Blog Post Liste -->
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
          </div>
        </div>

        <!-- Additional Blog Folder Window -->
        <div v-if="windowStore.isAdditionalBlogFolderOpen" class="window folder-window"
             :class="{ active: windowStore.activeWindow === 'additional-blog-folder' }"
             @click="windowStore.setActiveWindow('additional-blog-folder')"
             :style="windowStore.getWindowPosition('additional-blog-folder')">
          <div class="window-title" @mousedown="startDragAdditionalBlogFolder">
            <div class="title-icon blog-icon-title"></div>
            <span>Blog:</span>
            <div class="window-controls">
              <button class="depth-button"></button>
              <button class="zoom-button" @click="maximizeAdditionalBlogFolder"></button>
              <button class="close-button" @click="closeAdditionalBlogFolder"></button>
            </div>
          </div>
          <div class="window-content folder-content">
            <div class="title-bar blue-bar">Im Sumpf Blog</div>
            
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
          </div>
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

// Komponenten importieren
import BootSequence from './components/BootSequence.vue';
import WorkbenchMenuBar from './components/WorkbenchMenuBar.vue';
import WorkbenchWindow from './components/WorkbenchWindow.vue';
import BlogPreview from './components/BlogPreview.vue';

// Weitere Komponenten importieren
import AboutComponent from './components/AboutComponent.vue';
import SkillsComponent from './components/SkillsComponent.vue';
import ProjectsComponent from './components/ProjectsComponent.vue';
import ContactComponent from './components/ContactComponent.vue';
import TerminalComponent from './components/TerminalComponent.vue';
import GamesWindow from './components/GamesWindow.vue';
import FolderIcon from './components/FolderIcon.vue';
import NostrWindow from './components/NostrWindow.vue';
import BlogWindow from './components/BlogWindow.vue';
import { gamesData } from './assets/data/games.js';

export default {
  name: 'AmigaWorkbench',
  components: {
    BootSequence,
    WorkbenchMenuBar,
    WorkbenchWindow,
    BlogPreview,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    TerminalComponent,
    GamesWindow,
    FolderIcon,
    NostrWindow,
    BlogWindow
  },
  setup() {
    const systemStore = useSystemStore();
    const windowStore = useWindowStore();
    const menuStore = useMenuStore();
    const blogStore = useBlogStore();
    
    // Clock updater
    let clockTimer = null;
    
    // Games-Ordner-Funktionen
    const { 
      startDragGamesFolder, 
      maximizeGamesFolder, 
      closeGamesFolder,
      launchGame,
      gamesData
    } = useGamesFolderMixin();
    
    // Blog-Ordner-Funktionen
    const {
      startDragBlogFolder,
      maximizeBlogFolder,
      closeBlogFolder,
      startDragAdditionalBlogFolder,
      maximizeAdditionalBlogFolder,
      closeAdditionalBlogFolder,
      openBlogPost,
      openBlogWebsite
    } = useBlogFolderMixin();
    
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
      startDragGamesFolder,
      maximizeGamesFolder,
      closeGamesFolder,
      launchGame,
      gamesData,
      startDragBlogFolder,
      maximizeBlogFolder,
      closeBlogFolder,
      startDragAdditionalBlogFolder,
      maximizeAdditionalBlogFolder,
      closeAdditionalBlogFolder,
      openBlogPost,
      openBlogWebsite
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
</style>