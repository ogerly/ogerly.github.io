<template>
  <div class="vr-container">
    <div class="vr-controls">
      <button class="amiga-button" @click="startVR" v-if="vrSupported && !inVRMode">Enter VR</button>
      <button class="amiga-button" @click="exitVR" v-if="inVRMode">Exit VR</button>
      <button class="amiga-button" @click="toggleArcadeMode">{{ arcadeModeActive ? 'Exit Arcade' : 'Play Arcade' }}</button>
      <span class="vr-status" v-if="vrCheckComplete && !vrSupported">
        WebVR not supported in your browser. <button @click="forceEnableVR" class="text-button">Override?</button>
      </span>
      <span v-if="vrStatusMessage" class="vr-info">{{ vrStatusMessage }}</span>
    </div>
    
    <canvas ref="vrCanvas" class="vr-canvas"></canvas>
    
    <div class="amiga-info-panel">
      <div class="info-title">Retro Arcade 3D: Amiga Hall of Fame</div>
      <div class="info-description">
        A virtual arcade hall celebrating classic Amiga games. Walk around and interact with arcade machines.
      </div>
      <div v-if="vrSupported" class="info-controls">
        Controls: Look around with headset/mouse. Move with WASD keys. Interact with E key.
      </div>
    </div>
  </div>
</template>

<script src="./RetroArcade3D.js"></script>
<style src="./RetroArcade3D.css" scoped></style>
