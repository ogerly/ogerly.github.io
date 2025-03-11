import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'RetroArcade3D',
  setup() {
    const vrCanvas = ref(null);
    const vrSupported = ref(false);
    const vrCheckComplete = ref(false);
    const inVRMode = ref(false);
    const vrButtonElement = ref(null);
    const arcadeModeActive = ref(false);
    const vrStatusMessage = ref('');
    
    // Three.js variables
    let THREE, VRButton, XRControllerModelFactory;
    let scene, camera, renderer, controls;
    let arcadeCabinets = [];
    let player;
    let raycaster;
    
    // Amiga color palette
    const AMIGA_COLORS = {
      blue: 0x0055aa,
      lightBlue: 0x5A7594,
      orange: 0xff7700,
      yellow: 0xffcc00,
      white: 0xffffff,
      black: 0x000000,
      gray: 0xc0c0c0,
      darkGray: 0x444444,
      red: 0xff0000
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
    
    // Attempt to load Three.js modules dynamically
    const loadThreeJsModules = async () => {
      try {
        // Dynamic imports
        THREE = await import('three');
        const VRButtonModule = await import('three/examples/jsm/webxr/VRButton.js');
        const XRControllerModule = await import('three/examples/jsm/webxr/XRControllerModelFactory.js');
        const OrbitControlsModule = await import('three/examples/jsm/controls/OrbitControls.js');
        
        VRButton = VRButtonModule.VRButton;
        XRControllerModelFactory = XRControllerModule.XRControllerModelFactory;
        
        console.log('Three.js modules loaded successfully');
        return { THREE, VRButton, XRControllerModelFactory, OrbitControls: OrbitControlsModule.OrbitControls };
      } catch (error) {
        console.error('Failed to load Three.js modules:', error);
        return false;
      }
    };
    
    const initThreeJs = async () => {
      // Try to load Three.js modules
      const modules = await loadThreeJsModules();
      if (!modules) {
        console.error('Cannot initialize Three.js. Modules not loaded.');
        return;
      }
      
      const { THREE, VRButton, OrbitControls } = modules;
      
      // Create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(AMIGA_COLORS.blue);
      
      // Create camera
      camera = new THREE.PerspectiveCamera(75, vrCanvas.value.clientWidth / vrCanvas.value.clientHeight, 0.1, 1000);
      camera.position.set(0, 1.6, 5);
      
      // Create renderer
      renderer = new THREE.WebGLRenderer({
        canvas: vrCanvas.value,
        antialias: true
      });
      renderer.setSize(vrCanvas.value.clientWidth, vrCanvas.value.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      
      // Check for VR support more thoroughly
      vrSupported.value = await checkVRSupport();
      vrCheckComplete.value = true;
      
      // Enable VR if supported
      if (vrSupported.value) {
        renderer.xr.enabled = true;
        
        try {
          const vrButton = VRButton.createButton(renderer);
          
          // Store button in a unique global variable to prevent conflicts
          window._arcade_vr_button_element = vrButton;
          
          vrButton.classList.add('webvr-button');
          vrButton.classList.add('arcade-vr-button'); // Add specific class for this component
          vrButton.style.opacity = '0';
          vrButton.style.position = 'absolute';
          vrButton.style.bottom = '10px';
          vrButton.style.left = '50%';
          vrButton.style.transform = 'translateX(-50%)';
          vrButton.style.zIndex = '-1';
          
          document.body.appendChild(vrButton);
          vrButtonElement.value = vrButton;
          
          console.log('Arcade VR button created and appended successfully');
          
          // Session events
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
      
      // Set up orbit controls for desktop navigation
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      
      // Create raycaster for interaction
      raycaster = new THREE.Raycaster();
      
      // Build the arcade environment
      createArcadeEnvironment();
      
      // Start animation loop
      renderer.setAnimationLoop(animate);
      
      // Handle window resize
      window.addEventListener('resize', onWindowResize);
    };
    
    const createArcadeEnvironment = () => {
      if (!THREE) return;
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(AMIGA_COLORS.white, 0.5);
      scene.add(ambientLight);
      
      const mainLight = new THREE.DirectionalLight(AMIGA_COLORS.white, 0.8);
      mainLight.position.set(10, 10, 10);
      mainLight.castShadow = true;
      scene.add(mainLight);
      
      // Add some colorful spot lights for arcade atmosphere
      const spotLight1 = new THREE.SpotLight(AMIGA_COLORS.orange, 1, 15, Math.PI/4, 0.5, 1);
      spotLight1.position.set(-5, 7, 0);
      scene.add(spotLight1);
      
      const spotLight2 = new THREE.SpotLight(AMIGA_COLORS.yellow, 1, 15, Math.PI/4, 0.5, 1);
      spotLight2.position.set(5, 7, 0);
      scene.add(spotLight2);
      
      // Floor
      const floorGeometry = new THREE.PlaneGeometry(30, 30);
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: AMIGA_COLORS.darkGray,
        roughness: 0.8,
        metalness: 0.2
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.5;
      floor.receiveShadow = true;
      scene.add(floor);
      
      // Create grid pattern on floor
      const gridHelper = new THREE.GridHelper(30, 30, AMIGA_COLORS.white, AMIGA_COLORS.lightBlue);
      gridHelper.position.y = -0.49;
      scene.add(gridHelper);
      
      // Walls
      createWalls();
      
      // Create arcade cabinets
      createArcadeCabinets();
      
      // Ceiling with retro patterns
      createCeiling();
      
      // Amiga logo billboard
      createAmigaLogo();
    };
    
    const createWalls = () => {
      // Back wall
      const backWallGeometry = new THREE.PlaneGeometry(30, 10);
      const backWallMaterial = new THREE.MeshStandardMaterial({
        color: AMIGA_COLORS.lightBlue,
        roughness: 0.9
      });
      const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
      backWall.position.set(0, 5, -15);
      scene.add(backWall);
      
      // Side walls
      const sideWallGeometry = new THREE.PlaneGeometry(30, 10);
      const leftWall = new THREE.Mesh(sideWallGeometry, backWallMaterial);
      leftWall.position.set(-15, 5, 0);
      leftWall.rotation.y = Math.PI / 2;
      scene.add(leftWall);
      
      const rightWall = new THREE.Mesh(sideWallGeometry, backWallMaterial);
      rightWall.position.set(15, 5, 0);
      rightWall.rotation.y = -Math.PI / 2;
      scene.add(rightWall);
    };
    
    const createArcadeCabinets = () => {
      const classicGames = [
        { name: "Turrican", year: 1990, color: AMIGA_COLORS.blue },
        { name: "Defender of the Crown", year: 1986, color: 0x990000 },
        { name: "Lemmings", year: 1991, color: 0x009900 },
        { name: "Alien Breed", year: 1991, color: 0x009999 },
        { name: "Shadow of the Beast", year: 1989, color: 0x999900 },
        { name: "Speedball 2", year: 1990, color: 0x009900 }
      ];
      
      // Create multiple arcade cabinets in a row along the back wall
      classicGames.forEach((game, index) => {
        const arcade = createArcadeCabinet(game);
        const spacing = 5;
        arcade.position.set(-12.5 + (index * spacing), 0, -12);
        scene.add(arcade);
        arcadeCabinets.push({ mesh: arcade, game: game });
      });
    };
    
    const createArcadeCabinet = (game) => {
      // Create a group for the arcade cabinet
      const cabinet = new THREE.Group();
      
      // Main body of the cabinet
      const bodyGeometry = new THREE.BoxGeometry(2, 4, 1.5);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: game.color,
        roughness: 0.7,
        metalness: 0.3
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 2;
      body.castShadow = true;
      cabinet.add(body);
      
      // Screen
      const screenGeometry = new THREE.PlaneGeometry(1.5, 1.2);
      const screenCanvas = createGameScreen(game.name);
      const screenTexture = new THREE.CanvasTexture(screenCanvas);
      const screenMaterial = new THREE.MeshBasicMaterial({ 
        map: screenTexture,
        emissive: 0xffffff,
        emissiveIntensity: 0.2
      });
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.set(0, 2.8, 0.76);
      cabinet.add(screen);
      
      // Control panel
      const controlPanelGeometry = new THREE.BoxGeometry(2, 0.5, 1.8);
      const controlPanelMaterial = new THREE.MeshStandardMaterial({
        color: AMIGA_COLORS.black,
        roughness: 0.9
      });
      const controlPanel = new THREE.Mesh(controlPanelGeometry, controlPanelMaterial);
      controlPanel.position.set(0, 0.25, 0.9);
      controlPanel.rotation.x = -Math.PI / 6;
      cabinet.add(controlPanel);
      
      // Add joystick
      const joystickBase = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
      const joystickMaterial = new THREE.MeshStandardMaterial({
        color: AMIGA_COLORS.red,
        roughness: 0.7
      });
      const joystickBaseMesh = new THREE.Mesh(joystickBase, joystickMaterial);
      joystickBaseMesh.position.set(-0.5, 0.5, 0.75);
      cabinet.add(joystickBaseMesh);
      
      const joystickStick = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
      const joystickStickMesh = new THREE.Mesh(joystickStick, joystickMaterial);
      joystickStickMesh.position.set(-0.5, 0.7, 0.75);
      cabinet.add(joystickStickMesh);
      
      // Add buttons
      const buttonGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
      const redButtonMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.7,
        metalness: 0.3
      });
      
      const blueButtonMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        roughness: 0.7,
        metalness: 0.3
      });
      
      const button1 = new THREE.Mesh(buttonGeometry, redButtonMaterial);
      button1.position.set(0.3, 0.5, 0.75);
      button1.rotation.x = Math.PI / 2;
      cabinet.add(button1);
      
      const button2 = new THREE.Mesh(buttonGeometry, blueButtonMaterial);
      button2.position.set(0.6, 0.5, 0.75);
      button2.rotation.x = Math.PI / 2;
      cabinet.add(button2);
      
      // Add game name plate
      const namePlateGeometry = new THREE.PlaneGeometry(1.8, 0.3);
      const namePlateCanvas = createNamePlate(game.name, game.year);
      const namePlateTexture = new THREE.CanvasTexture(namePlateCanvas);
      const namePlateMaterial = new THREE.MeshBasicMaterial({
        map: namePlateTexture
      });
      const namePlate = new THREE.Mesh(namePlateGeometry, namePlateMaterial);
      namePlate.position.set(0, 1.2, 0.76);
      cabinet.add(namePlate);
      
      return cabinet;
    };
    
    const createGameScreen = (gameName) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      // Draw screen background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw some game-like content
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(gameName, canvas.width/2, 40);
      
      // Draw fake game content (simple shapes)
      ctx.fillStyle = '#' + AMIGA_COLORS.blue.toString(16).padStart(6, '0');
      ctx.fillRect(40, 60, 176, 100);
      
      ctx.fillStyle = '#' + AMIGA_COLORS.orange.toString(16).padStart(6, '0');
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2 + 20, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw score and lives
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText("SCORE: 0000", 20, canvas.height - 20);
      
      ctx.textAlign = 'right';
      ctx.fillText("LIVES: 3", canvas.width - 20, canvas.height - 20);
      
      return canvas;
    };
    
    const createNamePlate = (gameName, gameYear) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      
      // Background
      ctx.fillStyle = '#222222';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Border
      ctx.strokeStyle = '#' + AMIGA_COLORS.yellow.toString(16).padStart(6, '0');
      ctx.lineWidth = 3;
      ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
      
      // Game name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(gameName, canvas.width/2, canvas.height/2 - 2);
      
      // Year
      ctx.font = '14px Arial';
      ctx.fillText(gameYear, canvas.width/2, canvas.height/2 + 20);
      
      return canvas;
    };
    
    const createCeiling = () => {
      const ceilingGeometry = new THREE.PlaneGeometry(30, 30);
      const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: AMIGA_COLORS.darkGray,
        roughness: 0.8,
        side: THREE.DoubleSide
      });
      const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
      ceiling.position.set(0, 10, 0);
      ceiling.rotation.x = Math.PI / 2;
      scene.add(ceiling);
      
      // Add some retro neon lights to the ceiling
      const neonGeometry = new THREE.TorusGeometry(1, 0.1, 16, 32);
      const neonMaterial = new THREE.MeshBasicMaterial({
        color: AMIGA_COLORS.orange,
        emissive: AMIGA_COLORS.orange,
        emissiveIntensity: 2
      });
      
      for (let i = 0; i < 5; i++) {
        const neonRing = new THREE.Mesh(neonGeometry, neonMaterial);
        neonRing.position.set(i * 5 - 10, 9.8, 0);
        neonRing.rotation.x = Math.PI / 2;
        scene.add(neonRing);
      }
    };
    
    const createAmigaLogo = () => {
      const logoGeometry = new THREE.PlaneGeometry(8, 3);
      const logoCanvas = createAmigaLogoCanvas();
      const logoTexture = new THREE.CanvasTexture(logoCanvas);
      const logoMaterial = new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true
      });
      
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.position.set(0, 7, -14.5);
      scene.add(logo);
    };
    
    const createAmigaLogoCanvas = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 192;
      const ctx = canvas.getContext('2d');
      
      // Transparent background
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw logo box
      ctx.fillStyle = '#000000';
      ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
      
      // Colored border (rainbow effect)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ff0000');
      gradient.addColorStop(0.2, '#ffff00');
      gradient.addColorStop(0.4, '#00ff00');
      gradient.addColorStop(0.6, '#00ffff');
      gradient.addColorStop(0.8, '#0000ff');
      gradient.addColorStop(1, '#ff00ff');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 10;
      ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
      
      // DEVmatrose Arcade
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DEVmatrose', canvas.width/2, canvas.height/2 - 25);
      
      ctx.font = 'bold 40px Arial';
      ctx.fillText('ARCADE', canvas.width/2, canvas.height/2 + 35);
      
      return canvas;
    };
    
    const onWindowResize = () => {
      if (!camera || !renderer || !vrCanvas.value) return;
      
      camera.aspect = vrCanvas.value.clientWidth / vrCanvas.value.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(vrCanvas.value.clientWidth, vrCanvas.value.clientHeight);
    };
    
    const animate = () => {
      if (!scene || !camera || !renderer) return;
      
      // Update controls
      if (controls) controls.update();
      
      // Make arcade cabinet screens flicker slightly
      arcadeCabinets.forEach(cabinet => {
        const screen = cabinet.mesh.children.find(child => child.material && child.material.emissiveIntensity);
        if (screen) {
          // Random flicker effect
          screen.material.emissiveIntensity = 0.2 + Math.random() * 0.1;
        }
      });
      
      // Render the scene
      renderer.render(scene, camera);
    };
    
    const startVR = () => {
      if (!renderer || !vrSupported.value) {
        console.error('VR is not supported or renderer not initialized');
        return;
      }
      
      try {
        console.log('Attempting to start Arcade VR session...');
        
        // First approach: Use stored ref
        if (vrButtonElement.value) {
          console.log('Using Arcade vrButtonElement reference');
          vrButtonElement.value.click();
          return;
        }
        
        // Second approach: Try to find the button in the DOM with the specific class
        const vrButtonInDom = document.querySelector('.arcade-vr-button');
        if (vrButtonInDom) {
          console.log('Found Arcade VR button in DOM');
          vrButtonInDom.click();
          return;
        }
        
        // Third approach: Use global reference
        if (window._arcade_vr_button_element) {
          console.log('Using global Arcade VR button reference');
          window._arcade_vr_button_element.click();
          return;
        }
        
        // Fourth approach: Try to use the XR API directly
        if (navigator.xr && renderer.xr) {
          console.log('Using XR API directly for Arcade');
          
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
        
        console.error('All methods to start Arcade VR session failed');
      } catch (err) {
        console.error('Error starting Arcade VR session:', err);
        vrStatusMessage.value = `VR start error: ${err.message}`;
      }
    };
    
    const exitVR = () => {
      if (renderer && renderer.xr.getSession()) {
        renderer.xr.getSession().end();
      }
    };
    
    const toggleArcadeMode = () => {
      arcadeModeActive.value = !arcadeModeActive.value;
      
      if (arcadeModeActive.value) {
        // Change camera to first person perspective for arcade experience
        if (camera) {
          camera.position.set(0, 1.6, 5);
          camera.lookAt(0, 1.6, 0);
        }
        
        // Disable orbit controls
        if (controls) controls.enabled = false;
      } else {
        // Reset to observer perspective
        if (camera) {
          camera.position.set(0, 5, 10);
          camera.lookAt(0, 0, 0);
        }
        
        // Enable orbit controls
        if (controls) controls.enabled = true;
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
      
      if (vrButtonElement.value) {
        vrButtonElement.value.remove();
      }
      
      // Clean up global reference
      if (window._arcade_vr_button_element) {
        window._arcade_vr_button_element.remove();
        delete window._arcade_vr_button_element;
      }
      
      if (controls) controls.dispose();
    });
    
    return {
      vrCanvas,
      vrSupported,
      vrCheckComplete,
      inVRMode,
      vrStatusMessage,
      arcadeModeActive,
      startVR,
      exitVR,
      toggleArcadeMode,
      forceEnableVR
    };
  }
}