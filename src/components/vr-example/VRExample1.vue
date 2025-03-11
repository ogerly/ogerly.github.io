<template>
  <div class="vr-container">
    <div class="vr-controls">
      <button class="amiga-button" @click="startVR" v-if="vrSupported && !inVRMode">Enter VR</button>
      <button class="amiga-button" @click="exitVR" v-if="inVRMode">Exit VR</button>
      <span class="vr-status" v-if="vrCheckComplete && !vrSupported">
        WebVR not supported in your browser. <button @click="forceEnableVR" class="text-button">Override?</button>
      </span>
      <span v-if="vrStatusMessage" class="vr-info">{{ vrStatusMessage }}</span>
    </div>
    
    <canvas ref="vrCanvas" class="vr-canvas"></canvas>
    
    <div class="amiga-info-panel">
      <div class="info-title">VR Example 1: Amiga Cubes</div>
      <div class="info-description">
        A WebVR experience with Three.js. Experience floating cubes in Amiga colors.
      </div>
      <div v-if="vrSupported" class="info-controls">
        Controls: Look around with headset or mouse. Move with WASD keys.
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
// Import Three.js dynamically to avoid build errors if package is not installed
let THREE, VRButton, XRControllerModelFactory;

export default {
  name: 'VRExample1',
  setup() {
    const vrCanvas = ref(null);
    const vrSupported = ref(false);
    const vrCheckComplete = ref(false);
    const inVRMode = ref(false);
    const vrButtonElement = ref(null);
    const vrStatusMessage = ref('');
    
    // Three.js variables
    let scene, camera, renderer;
    let cubes = [];
    
    // Amiga-inspired colors
    const amigaColors = [
      0x0055aa, // Amiga blue
      0xffffff, // White
      0xff7700, // Orange
      0xffcc00, // Yellow
      0x5A7594  // Workbench blue
    ];
    
    // Attempt to load Three.js modules dynamically
    const loadThreeJsModules = async () => {
      try {
        // Dynamic imports
        THREE = await import('three');
        const VRButtonModule = await import('three/examples/jsm/webxr/VRButton.js');
        const XRControllerModule = await import('three/examples/jsm/webxr/XRControllerModelFactory.js');
        
        VRButton = VRButtonModule.VRButton;
        XRControllerModelFactory = XRControllerModule.XRControllerModelFactory;
        
        console.log('Three.js modules loaded successfully');
        return true;
      } catch (error) {
        console.error('Failed to load Three.js modules:', error);
        return false;
      }
    };
    
    // Improved XR support detection
    const checkVRSupport = async () => {
      try {
        // First check: navigator.xr existence
        if (!navigator.xr) {
          vrStatusMessage.value = "WebXR API not found";
          return false;
        }
        
        // Second check: try to see if immersive-vr session is supported
        let supported = false;
        try {
          supported = await navigator.xr.isSessionSupported('immersive-vr');
          if (supported) {
            vrStatusMessage.value = "WebXR immersive-vr supported";
            return true;
          } else {
            vrStatusMessage.value = "WebXR immersive-vr not supported";
          }
        } catch (err) {
          vrStatusMessage.value = `WebXR check error: ${err.message}`;
        }
        
        // Third check: try WebVR API as fallback (older browsers)
        if (navigator.getVRDisplays || window.VRFrameData) {
          vrStatusMessage.value = "Using legacy WebVR API";
          return true;
        }
        
        // Fourth check: If all else fails, check for common VR browser features
        const userAgent = navigator.userAgent.toLowerCase();
        if (
          userAgent.includes('oculus') || 
          userAgent.includes('quest') ||
          userAgent.includes('vive') || 
          userAgent.includes('steamvr') ||
          userAgent.includes('firefox') && userAgent.includes('webvr')
        ) {
          vrStatusMessage.value = "VR hardware detected, forcing enable";
          return true;
        }
        
        return false;
      } catch (err) {
        console.error("Error checking VR support:", err);
        vrStatusMessage.value = `VR check error: ${err.message}`;
        return false;
      }
    };
    
    const forceEnableVR = () => {
      vrSupported.value = true;
      vrStatusMessage.value = "VR support manually enabled";
    };
    
    const initThreeJs = async () => {
      // Try to load Three.js modules
      const modulesLoaded = await loadThreeJsModules();
      if (!modulesLoaded) {
        console.error('Cannot initialize Three.js. Modules not loaded.');
        return;
      }
      
      // Create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0055aa); // Amiga blue background
      
      // Create camera
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 1.6, 3); // Set camera at human eye level
      
      // Create renderer
      renderer = new THREE.WebGLRenderer({
        canvas: vrCanvas.value,
        antialias: true
      });
      renderer.setSize(vrCanvas.value.clientWidth, vrCanvas.value.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      
      // Check for VR support more thoroughly
      vrSupported.value = await checkVRSupport();
      vrCheckComplete.value = true;
      
      // Enable VR if supported
      if (vrSupported.value) {
        renderer.xr.enabled = true;
        
        // Add VR button to the renderer's DOM element
        try {
          const vrButton = VRButton.createButton(renderer);
          
          // Important: Store the button in a global variable to ensure it remains accessible
          window._vr_button_element = vrButton;
          
          vrButton.classList.add('webvr-button');
          vrButton.style.opacity = '0'; // Hide the default button as we have our own
          vrButton.style.position = 'absolute';
          vrButton.style.bottom = '10px';
          vrButton.style.left = '50%';
          vrButton.style.transform = 'translateX(-50%)';
          vrButton.style.zIndex = '-1'; // Keep it clickable but invisible
          
          document.body.appendChild(vrButton);
          vrButtonElement.value = vrButton;
          
          console.log('VR button created and appended successfully');
          
          // Listen for VR session start/end
          renderer.xr.addEventListener('sessionstart', () => {
            inVRMode.value = true;
            vrStatusMessage.value = "VR session active";
          });
          renderer.xr.addEventListener('sessionend', () => {
            inVRMode.value = false;
            vrStatusMessage.value = "VR session ended";
          });
        } catch (err) {
          console.error('Failed to create VR button:', err);
          vrStatusMessage.value = `VR button error: ${err.message}`;
        }
      }
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 5);
      scene.add(directionalLight);
      
      // Add Amiga-colored cubes
      for (let i = 0; i < 20; i++) {
        const geometry = new THREE.BoxGeometry(
          Math.random() * 0.5 + 0.1, 
          Math.random() * 0.5 + 0.1, 
          Math.random() * 0.5 + 0.1
        );
        const material = new THREE.MeshStandardMaterial({ 
          color: amigaColors[Math.floor(Math.random() * amigaColors.length)],
          metalness: 0.3,
          roughness: 0.7
        });
        
        const cube = new THREE.Mesh(geometry, material);
        
        // Position cubes randomly
        cube.position.x = Math.random() * 10 - 5;
        cube.position.y = Math.random() * 5;
        cube.position.z = Math.random() * 10 - 10;
        
        // Add to scene and cubes array
        scene.add(cube);
        cubes.push({
          mesh: cube,
          rotationSpeed: {
            x: Math.random() * 0.02 - 0.01,
            y: Math.random() * 0.02 - 0.01,
            z: Math.random() * 0.02 - 0.01
          },
          floatSpeed: Math.random() * 0.01
        });
      }
      
      // Add a grid floor (classic computing style)
      const gridHelper = new THREE.GridHelper(20, 20, 0xffffff, 0x0055aa);
      gridHelper.position.y = -0.5;
      scene.add(gridHelper);
      
      // Add Amiga-style emblem
      createAmigaEmblem();
      
      // Start animation loop
      renderer.setAnimationLoop(animate);
      
      // Handle window resize
      window.addEventListener('resize', onWindowResize);
    };
    
    const createAmigaEmblem = () => {
      // Create a simple Amiga-inspired logo
      const geometry = new THREE.PlaneGeometry(2, 1);
      const texture = new THREE.CanvasTexture(createAmigaLogoCanvas());
      const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const logo = new THREE.Mesh(geometry, material);
      logo.position.set(0, 3, -5);
      scene.add(logo);
    };
    
    const createAmigaLogoCanvas = () => {
      // Create a canvas to draw the Amiga-style logo
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      
      // Fill background with transparent
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw "DEVmatrose VR" text in Amiga style
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DEVmatrose VR', canvas.width/2, canvas.height/2);
      
      // Add a border in Amiga style
      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, canvas.width-20, canvas.height-20);
      
      return canvas;
    };
    
    const animate = () => {
      // Animate cubes
      for (let cube of cubes) {
        cube.mesh.rotation.x += cube.rotationSpeed.x;
        cube.mesh.rotation.y += cube.rotationSpeed.y;
        cube.mesh.rotation.z += cube.rotationSpeed.z;
        
        // Make cubes float up and down
        cube.mesh.position.y += Math.sin(Date.now() * cube.floatSpeed) * 0.005;
      }
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    const onWindowResize = () => {
      if (vrCanvas.value) {
        camera.aspect = vrCanvas.value.clientWidth / vrCanvas.value.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(vrCanvas.value.clientWidth, vrCanvas.value.clientHeight);
      }
    };
    
    // Enhanced startVR function to handle more cases
    const startVR = () => {
      if (!renderer) {
        console.error('Renderer not initialized');
        return;
      }
      
      try {
        console.log('Attempting to start VR session...');
        
        // First approach: Use stored ref
        if (vrButtonElement.value) {
          console.log('Using vrButtonElement reference');
          vrButtonElement.value.click();
          return;
        }
        
        // Second approach: Try to find the button in the DOM
        const vrButtonInDom = document.querySelector('.webvr-button');
        if (vrButtonInDom) {
          console.log('Found VR button in DOM');
          vrButtonInDom.click();
          return;
        }
        
        // Third approach: Use global reference
        if (window._vr_button_element) {
          console.log('Using global VR button reference');
          window._vr_button_element.click();
          return;
        }
        
        // Fourth approach: Try to use the XR API directly
        if (navigator.xr && renderer.xr) {
          console.log('Using XR API directly');
          
          navigator.xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking']
          }).then((session) => {
            renderer.xr.setSession(session);
            inVRMode.value = true;
            vrStatusMessage.value = "VR session started manually";
          }).catch((error) => {
            console.error('Failed to start XR session:', error);
            vrStatusMessage.value = `XR session error: ${error.message}`;
          });
          return;
        }
        
        // As a last resort, force enable if we might have support
        forceEnableVR();
        vrStatusMessage.value = "Attempted to force VR mode";
        
      } catch (err) {
        console.error('Error starting VR session:', err);
        vrStatusMessage.value = `VR start error: ${err.message}`;
      }
    };
    
    const exitVR = () => {
      if (renderer && renderer.xr.getSession()) {
        renderer.xr.getSession().end();
      }
    };
    
    onMounted(() => {
      if (vrCanvas.value) {
        initThreeJs();
      }
    });
    
    onBeforeUnmount(() => {
      if (renderer) {
        renderer.dispose();
        renderer.setAnimationLoop(null);
      }
      window.removeEventListener('resize', onWindowResize);
      
      // Remove VR button if it was added
      if (vrButtonElement.value) {
        vrButtonElement.value.remove();
      }
      
      // Clean up global reference
      if (window._vr_button_element) {
        window._vr_button_element.remove();
        delete window._vr_button_element;
      }
    });
    
    return {
      vrCanvas,
      vrSupported,
      vrCheckComplete,
      inVRMode,
      vrStatusMessage,
      startVR,
      exitVR,
      forceEnableVR
    };
  }
}
</script>

<style scoped>
.vr-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black;
  display: flex;
  flex-direction: column;
}

.vr-canvas {
  flex: 1;
  width: 100%;
  border: 2px solid var(--window-blue);
}

.vr-controls {
  padding: 8px;
  background-color: var(--window-gray);
  display: flex;
  align-items: center;
  gap: 10px;
}

.amiga-button {
  background-color: var(--window-blue);
  color: white;
  border: 2px solid var(--text-dark);
  padding: 5px 12px;
  font-family: 'Topaz', 'Courier New', monospace;
  cursor: pointer;
}

.amiga-button:hover {
  background-color: #0066cc;
}

.vr-status {
  font-family: 'Topaz', 'Courier New', monospace;
  font-size: 12px;
  color: red;
}

.amiga-info-panel {
  padding: 10px;
  background-color: var(--window-gray);
  border-top: 1px solid var(--text-dark);
}

.info-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.info-description, .info-controls {
  font-size: 12px;
  margin-bottom: 5px;
}

.vr-info {
  font-family: 'Topaz', 'Courier New', monospace;
  font-size: 12px;
  color: #00ccff;
  margin-left: 10px;
}

.text-button {
  background: none;
  border: none;
  color: #ffcc00;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-family: 'Topaz', 'Courier New', monospace;
  font-size: 12px;
}

.text-button:hover {
  color: #ffffff;
}
</style>
