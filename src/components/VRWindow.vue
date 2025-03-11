<template>
  <div class="vr-window">
    <div class="vr-selector" v-if="showSelector">
      <div class="vr-selector-header">
        <h2>Select VR Experience</h2>
      </div>
      <div class="vr-selector-options">
        <button 
          v-for="(example, id) in vrExamples" 
          :key="id"
          :class="['vr-selector-option', { active: currentExampleId === id }]"
          @click="selectVRExample(id)">
          {{ example.title }}
        </button>
      </div>
    </div>
    
    <div v-if="hasThreeJs && !loadError" class="vr-example-container">
      <div class="vr-example-header">
        <button class="amiga-button small" @click="toggleSelector">
          {{ showSelector ? 'Hide Menu' : 'Change Experience' }}
        </button>
        <span class="vr-example-title">{{ currentExampleTitle }}</span>
      </div>
      <component :is="currentVRComponent" ref="vrComponent" />
    </div>
    <div v-else class="vr-error">
      <div class="vr-error-content">
        <h3>{{ errorTitle }}</h3>
        <p>{{ errorMessage }}</p>
        <pre v-if="errorDetails">{{ errorDetails }}</pre>
        <button class="reload-button" @click="checkAndReload">{{ retryButtonText }}</button>
      </div>
    </div>
    
    <div class="vr-debug-panel" v-if="showDebugInfo">
      <h4>WebXR/WebVR Debug Info</h4>
      <div class="debug-info">
        <p><strong>navigator.xr available:</strong> {{ !!navigator.xr }}</p>
        <p v-if="sessionSupportInfo"><strong>Session support:</strong> {{ sessionSupportInfo }}</p>
        <p><strong>User Agent:</strong> {{ userAgent }}</p>
        <p><strong>Screen:</strong> {{ screen.width }}x{{ screen.height }} ({{ detectMobile() ? 'Mobile' : 'Desktop' }})</p>
        <button class="amiga-button" @click="testVRSupport">Test VR Support</button>
        <button class="amiga-button" @click="closeDebugPanel">Close</button>
      </div>
    </div>
    
    <button 
      @click="toggleDebugInfo" 
      class="debug-button" 
      v-if="!showSelector && hasThreeJs && !loadError"
      title="Show VR Debug Info">
      ?
    </button>
  </div>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue';
import VRExample1 from './vr-example/VRExample1.vue';
import RetroArcade3D from './vr-example/RetroArcade3D/RetroArcade3D.vue';
import { useWindowStore } from '../stores/windowStore';

export default {
  name: 'VRWindow',
  components: {
    VRExample1,
    RetroArcade3D
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const windowStore = useWindowStore();
    const hasThreeJs = ref(false);
    const loadError = ref(false);
    const errorTitle = ref('Loading VR Experience');
    const errorMessage = ref('Checking environment compatibility...');
    const errorDetails = ref('');
    const retryButtonText = ref('Retry');
    const showSelector = ref(false);
    const vrComponent = ref(null);
    
    // Available VR examples
    const vrExamples = {
      VRExample1: { 
        title: 'Amiga Cubes', 
        description: 'Floating cubes in Amiga colors' 
      },
      RetroArcade3D: { 
        title: 'Retro Arcade Hall', 
        description: 'Walk around an arcade hall with classic Amiga games' 
      }
    };
    
    // Get the current selected example ID
    const currentExampleId = computed(() => {
      return props.data.activeExample || 'VRExample1';
    });
    
    const currentExampleTitle = computed(() => {
      return vrExamples[currentExampleId.value]?.title || 'VR Experience';
    });
    
    // Map the components
    const componentMap = {
      VRExample1,
      RetroArcade3D
    };
    
    // Get the current VR example component based on props
    const currentVRComponent = computed(() => {
      return componentMap[currentExampleId.value] || VRExample1;
    });
    
    const selectVRExample = (exampleId) => {
      // Clean up existing VR buttons when switching experiences
      cleanupVRButtons();
      
      // Update the active example in the store
      if (windowStore.windows.vrar) {
        windowStore.windows.vrar.data = {
          ...windowStore.windows.vrar.data,
          activeExample: exampleId
        };
      }
      
      // Hide selector after selection
      showSelector.value = false;
    };
    
    const toggleSelector = () => {
      showSelector.value = !showSelector.value;
    };
    
    const cleanupVRButtons = () => {
      // Clean up any VR buttons that might be in the DOM
      const vrButtons = document.querySelectorAll('.webvr-button');
      vrButtons.forEach(button => button.remove());
      
      // Clean up global references
      if (window._vr_button_element) {
        delete window._vr_button_element;
      }
      if (window._arcade_vr_button_element) {
        delete window._arcade_vr_button_element;
      }
    };
    
    const checkThreeJs = async () => {
      try {
        const module = await import('three');
        // Also check if WebXR/WebVR is potentially available
        if (navigator.xr || window.VRFrameData) {
          hasThreeJs.value = true;
          loadError.value = false;
          return true;
        } else {
          // Device might not support VR
          errorTitle.value = 'WebXR/WebVR Not Detected';
          errorMessage.value = 'Your browser does not appear to support WebXR or WebVR. Try using a compatible browser like Chrome or Firefox.';
          retryButtonText.value = 'Check Again';
          hasThreeJs.value = true; // Allow loading even if WebVR not available
          loadError.value = false;
          return true;
        }
      } catch (error) {
        console.error('Three.js loading error:', error);
        errorTitle.value = 'Three.js not found';
        errorMessage.value = 'The Three.js library is required for VR examples. Run the following command to install it:';
        errorDetails.value = 'npm install three';
        retryButtonText.value = 'Check Again';
        hasThreeJs.value = false;
        loadError.value = true;
        return false;
      }
    };
    
    const checkAndReload = async () => {
      errorMessage.value = 'Checking dependencies...';
      await checkThreeJs();
      
      // Force component reload
      hasThreeJs.value = false;
      setTimeout(() => {
        if (!loadError.value) {
          hasThreeJs.value = true;
        }
      }, 100);
    };
    
    // Watch for window close to clean up VR buttons
    watch(() => windowStore.windows.vrar?.visible, (isVisible) => {
      if (!isVisible) {
        cleanupVRButtons();
      }
    });
    
    onMounted(() => {
      checkThreeJs();
    });
    
    const showDebugInfo = ref(false);
    const sessionSupportInfo = ref('');
    const userAgent = navigator.userAgent;
    
    const toggleDebugInfo = () => {
      showDebugInfo.value = !showDebugInfo.value;
    };
    
    const closeDebugPanel = () => {
      showDebugInfo.value = false;
    };
    
    const detectMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    };
    
    const testVRSupport = async () => {
      try {
        if (navigator.xr) {
          // Test immersive-vr
          try {
            const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
            sessionSupportInfo.value = vrSupported 
              ? 'immersive-vr: Supported!' 
              : 'immersive-vr: Not supported';
          } catch (err) {
            sessionSupportInfo.value = `Error checking VR support: ${err.message}`;
          }
        } else {
          sessionSupportInfo.value = 'WebXR API not available';
        }
      } catch (err) {
        sessionSupportInfo.value = `Error: ${err.message}`;
      }
    };
    
    return {
      vrComponent,
      currentVRComponent,
      currentExampleId,
      currentExampleTitle,
      vrExamples,
      hasThreeJs,
      loadError,
      errorTitle,
      errorMessage,
      errorDetails,
      retryButtonText,
      checkAndReload,
      showSelector,
      toggleSelector,
      selectVRExample,
      showDebugInfo,
      sessionSupportInfo,
      userAgent,
      screen,
      toggleDebugInfo,
      closeDebugPanel,
      detectMobile,
      testVRSupport
    };
  }
}
</script>

<style scoped>
.vr-window {
  width: 100%;
  height: 100%;
  background-color: var(--window-gray);
  overflow: hidden;
  position: relative;
}

.vr-error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.vr-error-content {
  background-color: #fff;
  border: 2px solid var(--window-blue);
  padding: 20px;
  text-align: center;
  max-width: 80%;
}

.vr-error-content h3 {
  color: var(--window-blue);
  margin-bottom: 10px;
}

.vr-error-content pre {
  background-color: #333;
  color: #fff;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  font-family: monospace;
}

.reload-button {
  background-color: var(--window-blue);
  color: white;
  border: none;
  padding: 8px 16px;
  margin-top: 10px;
  cursor: pointer;
}

.reload-button:hover {
  background-color: #0066cc;
}

.vr-example-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.vr-example-header {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: var(--window-blue);
  color: white;
}

.vr-example-title {
  margin-left: 10px;
  font-weight: bold;
}

.vr-selector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.vr-selector-header {
  color: white;
  margin-bottom: 20px;
}

.vr-selector-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80%;
  max-width: 400px;
}

.vr-selector-option {
  background-color: var(--window-blue);
  color: white;
  border: 2px solid var(--text-light);
  padding: 10px;
  font-family: 'Topaz', 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vr-selector-option:hover {
  background-color: var(--workbench-blue);
  transform: translateY(-2px);
}

.vr-selector-option.active {
  border-color: var(--folder-yellow);
  box-shadow: 0 0 8px var(--folder-yellow);
}

.amiga-button.small {
  font-size: 12px;
  padding: 2px 8px;
}

.vr-debug-panel {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 10px;
  border: 1px solid var(--window-blue);
  z-index: 500;
  max-width: 80%;
  font-family: monospace;
  font-size: 12px;
}

.vr-debug-panel h4 {
  margin-top: 0;
  color: var(--folder-yellow);
}

.debug-info p {
  margin: 5px 0;
}

.debug-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background-color: var(--window-blue);
  color: white;
  border: 1px solid var(--text-light);
  border-radius: 50%;
  font-weight: bold;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.debug-button:hover {
  background-color: var(--folder-yellow);
}
</style>
