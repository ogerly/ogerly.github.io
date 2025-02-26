<template>
  <div class="desktop">
    <!-- Fenster -->
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
        @click="windowStore.openGamesFolder"
      />
      <div class="desktop-icon" @click="windowStore.toggleWindow('nostr')">
        <div class="icon nostr-icon"></div>
        <span>NostrOS</span>
      </div>
      <div class="desktop-icon" @click="windowStore.toggleWindow('blog')">
        <div class="icon blog-icon"></div>
        <span>Im Sumpf</span>
      </div>
    </div>
    
    <!-- FloppyDisk animation -->
    <div class="disk-drive">
      <div class="disk-slot"></div>
      <div class="disk-led" :class="{ 'active': systemStore.diskActivity }"></div>
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
               @click="windowStore.launchGame(game)">
            <div class="disk-icon">
              <div class="disk-label">{{ game.title.substring(0