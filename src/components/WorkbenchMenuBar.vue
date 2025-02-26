<template>
  <div class="menu-container">
    <div class="topbar">
      <div class="workbench-icon" @click="menuStore.toggleMenu('workbench')"></div>
      <div class="menu-items">
        <span @click="menuStore.toggleMenu('workbench')">Workbench</span>
        <span @click="menuStore.toggleMenu('disk')">Disk</span>
        <span @click="menuStore.toggleMenu('system')">System</span>
        <span @click="menuStore.toggleMenu('special')">Special</span>
      </div>
      <div class="memory-indicator">
        Chip: 512K  Fast: 512K  <span class="clock">{{ systemStore.currentTime }}</span>
      </div>
    </div>
    
    <!-- Dropdown menus -->
    <div v-if="menuStore.activeMenu" class="dropdown-menu" :class="menuStore.activeMenu">
      <div class="menu-item" @click="menuStore.menuAction('about')">About...</div>
      <div class="menu-item" @click="menuStore.menuAction('skills')">Skills</div>
      <div class="menu-item" @click="menuStore.menuAction('projects')">Projects</div>
      <div class="menu-item" @click="menuStore.menuAction('contact')">Contact</div>
      <div class="menu-item" @click="menuStore.menuAction('blog')">Blog</div>
      <div class="menu-separator"></div>
      <div class="menu-item" @click="menuStore.menuAction('reboot')">Reboot</div>
    </div>
  </div>
</template>

<script>
import { useMenuStore } from '../stores/menuStore';
import { useSystemStore } from '../stores/systemStore';

export default {
  name: 'WorkbenchMenuBar',
  setup() {
    const menuStore = useMenuStore();
    const systemStore = useSystemStore();
    
    return { menuStore, systemStore };
  }
}
</script>
