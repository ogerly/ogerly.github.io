<template>
  <div 
    class="window amiga-window"
    :class="{ 
      'active': isActive, 
      'maximized': isMaximized,
      [themeClass]: true
    }"
    :style="windowStyle"
    @click="$emit('activate')">
    
    <!-- Window title bar -->
    <div 
      class="window-title" 
      @mousedown="startDrag"
      :style="{ backgroundColor: titleBarColor }">
      <!-- Icon -->
      <div 
        class="title-icon" 
        :class="iconClass" 
        :style="{ backgroundColor: iconBackgroundColor }">
      </div>
      
      <!-- Title -->
      <span>{{ title }}</span>
      
      <!-- Window controls -->
      <div class="window-controls">
        <button class="depth-button" @click.stop="$emit('minimize')"></button>
        <button class="zoom-button" @click.stop="toggleMaximize"></button>
        <button class="close-button" @click.stop="$emit('close')"></button>
      </div>
    </div>
    
    <!-- Window content -->
    <div 
      class="window-content"
      :style="{ backgroundColor: contentBackgroundColor, color: contentTextColor, height: contentHeight }">
      
      <!-- Subtitle bar (optional) -->
      <div 
        v-if="subtitle" 
        class="title-bar blue-bar"
        :style="{ backgroundColor: subtitleBarColor, color: subtitleTextColor }">
        {{ subtitle }}
      </div>
      
      <!-- Main content slot -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useSystemStore } from '../stores/systemStore';

export default {
  name: 'WindowComponent',
  props: {
    // Window identity and content
    windowId: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    iconClass: { type: String, default: '' },
    
    // State
    isActive: { type: Boolean, default: false },
    initMaximized: { type: Boolean, default: false },
    
    // Position and size
    position: { 
      type: Object, 
      default: () => ({ top: '50px', left: '100px', width: '400px', zIndex: 5 }) 
    },
    
    // Appearance
    theme: { 
      type: String, 
      default: 'default',
      validator: (value) => ['default', 'terminal', 'folder', 'blog', 'game'].includes(value)
    },
    titleBarColor: { type: String, default: 'var(--window-blue)' },
    iconBackgroundColor: { type: String, default: 'var(--text-light)' },
    contentBackgroundColor: { type: String, default: 'var(--window-gray)' },
    contentTextColor: { type: String, default: 'var(--text-dark)' },
    subtitleBarColor: { type: String, default: 'var(--window-blue)' },
    subtitleTextColor: { type: String, default: 'var(--text-light)' },
    contentHeight: { type: String, default: 'auto' }
  },
  
  emits: ['close', 'minimize', 'maximize', 'activate', 'drag', 'update:position'],
  
  setup(props, { emit }) {
    const systemStore = useSystemStore();
    const isMaximized = ref(props.initMaximized);
    const previousPosition = ref(null);
    const isDragging = ref(false);
    const dragOffset = ref({ x: 0, y: 0 });
    
    // Compute styling for the window
    const windowStyle = computed(() => {
      return {
        ...props.position,
        width: props.position.width || 'auto',
        height: props.position.height || 'auto'
      };
    });
    
    // Theme class computation based on theme prop
    const themeClass = computed(() => {
      return `window-theme-${props.theme}`;
    });
    
    // Methods for window interaction
    const toggleMaximize = () => {
      systemStore.playClickSound();
      
      if (!isMaximized.value) {
        // Store current position before maximizing
        previousPosition.value = { ...props.position };
        
        // Emit maximize event with new maximized position
        emit('maximize', {
          top: '20px',
          left: '0',
          width: 'calc(100% - 4px)',
          height: 'calc(100vh - 24px)',
          zIndex: props.position.zIndex
        });
      } else {
        // Restore previous position
        if (previousPosition.value) {
          emit('maximize', previousPosition.value);
        }
      }
      
      isMaximized.value = !isMaximized.value;
    };
    
    // Start dragging the window
    const startDrag = (event) => {
      // Only allow dragging if not maximized
      if (isMaximized.value) return;
      
      emit('activate');
      
      isDragging.value = true;
      
      // Calculate offset
      const rect = event.target.getBoundingClientRect();
      dragOffset.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      
      // Add event listeners
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
    };
    
    // Handle window drag
    const handleDrag = (event) => {
      if (!isDragging.value) return;
      
      const newPosition = {
        ...props.position,
        top: `${event.clientY - dragOffset.value.y}px`,
        left: `${event.clientX - dragOffset.value.x}px`
      };
      
      emit('update:position', newPosition);
      emit('drag', { x: event.clientX, y: event.clientY });
    };
    
    // Stop dragging
    const stopDrag = () => {
      isDragging.value = false;
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    return {
      isMaximized,
      windowStyle,
      themeClass,
      toggleMaximize,
      startDrag
    };
  }
}
</script>

<style scoped>
/* Base window styling */
.amiga-window {
  position: absolute;
  background-color: var(--window-gray);
  border: 1px solid var(--text-dark);
  box-shadow: 3px 3px 0 rgba(0,0,0,0.5);
  min-width: 320px;
  min-height: 120px;
  z-index: 1;
  transition: box-shadow 0.2s, transform 0.3s;
  transform-origin: center;
}

.amiga-window:before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: repeating-conic-gradient(
    var(--text-dark) 0% 25%, 
    var(--workbench-blue) 0% 50%
  ) 50% / 4px 4px;
  z-index: -1;
}

.amiga-window.active {
  box-shadow: 5px 5px 0 rgba(0,0,0,0.7);
  z-index: 10 !important;
  transform: scale(1.01);
}

.amiga-window.maximized {
  box-shadow: none;
}

.window-title {
  color: var(--text-light);
  display: flex;
  align-items: center;
  padding: 2px;
  height: 18px;
  cursor: move;
  user-select: none;
}

.title-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  position: relative;
}

.window-controls {
  margin-left: auto;
  display: flex;
  gap: 2px;
}

.depth-button,
.zoom-button,
.close-button {
  width: 16px;
  height: 16px;
  background-color: var(--window-gray);
  border: 1px solid var(--text-dark);
  box-shadow: 1px 1px 0 var(--text-light) inset, -1px -1px 0 #555 inset;
  padding: 0;
  cursor: pointer;
  position: relative;
}

.close-button:hover {
  background-color: #f88;
}

.close-button:after {
  content: "×";
  position: absolute;
  top: -3px;
  left: 3px;
  font-size: 16px;
  color: #333;
}

.zoom-button:after {
  content: "□";
  position: absolute;
  top: -3px;
  left: 3px;
  font-size: 14px;
  color: #333;
}

.depth-button:after {
  content: "_";
  position: absolute;
  top: -7px;
  left: 5px;
  font-size: 16px;
  color: #333;
}

.window-content {
  padding: 10px;
  overflow: auto;
  max-height: calc(100vh - 60px);
}

.title-bar {
  margin: -10px -10px 10px -10px;
  padding: 4px;
  font-weight: bold;
}

/* Theme variations */
.window-theme-terminal .window-content {
  background-color: #000;
  color: #50f050;
  font-family: monospace;
}

.window-theme-folder .title-icon {
  background-color: var(--folder-yellow) !important;
}

.window-theme-blog .title-icon:after {
  content: "B";
  position: absolute;
  top: 1px;
  left: 5px;
  color: var(--window-blue);
  font-weight: bold;
}

.window-theme-game .title-icon:after {
  content: "G";
  position: absolute;
  top: 1px;
  left: 5px;
  color: var(--dev-green);
  font-weight: bold;
}

/* Responsive styles */
@media (max-width: 768px) {
  .amiga-window {
    min-width: 280px;
  }
}

@media (max-width: 480px) {
  .amiga-window {
    min-width: 95vw;
    left: 2.5vw !important;
  }
  
  .amiga-window.maximized {
    left: 0 !important;
    width: 100vw !important;
  }
}
</style>
