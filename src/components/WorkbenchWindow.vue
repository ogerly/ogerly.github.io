<template>
  <div class="window"
       :class="{ 'active': isActive, 'maximized': window.isMaximized }"
       :style="window.position">
    
    <div class="window-title" @mousedown="startDrag">
      <div class="title-icon" :class="iconClass"></div>
      <span>{{ window.title }}</span>
      <div class="window-controls">
        <button @click="minimizeWindow" class="depth-button"></button>
        <button @click="maximizeWindow" class="zoom-button"></button>
        <button @click="closeWindow" class="close-button"></button>
      </div>
    </div>

    <div class="window-content">
      <div class="title-bar blue-bar">{{ window.subtitle }}</div>
      <!-- Hier die richtige Komponente dynamisch laden -->
      <component 
        :is="resolveComponent(window.component)" 
        :data="window.data" 
        class="component-container"
      ></component>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useWindowStore } from '../stores/windowStore';
// Importiere alle Fenster-Inhalts-Komponenten explizit
import AboutComponent from './AboutComponent.vue';
import SkillsComponent from './SkillsComponent.vue';
import ProjectsComponent from './ProjectsComponent.vue';
import ContactComponent from './ContactComponent.vue';
import TerminalComponent from './TerminalComponent.vue';
import BlogWindow from './BlogWindow.vue';
import NostrWindow from './NostrWindow.vue';

export default {
  name: 'WorkbenchWindow',
  components: {
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    TerminalComponent,
    BlogWindow,
    NostrWindow
  },
  props: {
    windowName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const windowStore = useWindowStore();
    
    const window = computed(() => windowStore.windows[props.windowName]);
    const isActive = computed(() => windowStore.activeWindow === props.windowName);
    const iconClass = computed(() => props.windowName + '-icon');
    
    // Löst den Komponentennamen zu der tatsächlichen Komponente auf
    const resolveComponent = (componentName) => {
      // Registrierte Komponenten zurückgeben
      return componentName; // Vue wird die registrierte Komponente finden
    };
    
    const startDrag = (event) => {
      windowStore.startDrag(props.windowName, event);
    };
    
    const minimizeWindow = () => {
      windowStore.minimizeWindow(props.windowName);
    };
    
    const maximizeWindow = () => {
      windowStore.maximizeWindow(props.windowName);
    };
    
    const closeWindow = () => {
      windowStore.closeWindow(props.windowName);
    };
    
    return {
      window,
      isActive,
      iconClass,
      resolveComponent,
      startDrag,
      minimizeWindow,
      maximizeWindow,
      closeWindow
    };
  }
}
</script>
