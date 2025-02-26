<template>
  <div class="window">
    <div class="window-title">
      <div class="title-icon games-icon"></div>
      <span>Amiga Games</span>
      <div class="window-controls">
        <button class="depth-button"></button>
        <button class="zoom-button" @click="$emit('maximize')"></button>
        <button class="close-button" @click="$emit('close')"></button>
      </div>
    </div>
    
    <div class="window-content">
      <div class="title-bar blue-bar">Amiga Open-Source Spiele</div>
      
      <div class="game-grid">
        <div 
          v-for="game in availableGames" 
          :key="game.id" 
          class="game-card"
          @click="selectGame(game)"
          :class="{ 'selected': selectedGame?.id === game.id }"
        >
          <div class="game-icon" :style="{ 'background-image': `url(${game.thumbnail})` }"></div>
          <div class="game-info">
            <strong>{{ game.title }}</strong>
            <small>{{ game.genre }} | {{ game.year }}</small>
          </div>
        </div>
      </div>
      
      <div v-if="selectedGame" class="game-details">
        <div class="title-bar">{{ selectedGame.title }}</div>
        <div class="text-content">
          <p><strong>Beschreibung:</strong> {{ selectedGame.description }}</p>
          <p><strong>Genre:</strong> {{ selectedGame.genre }}</p>
          <p><strong>Jahr:</strong> {{ selectedGame.year }}</p>
          <p><strong>Lizenz:</strong> {{ selectedGame.license }}</p>
          <button class="amiga-button" @click="launchGame">Spiel starten</button>
        </div>
      </div>
      
      <!-- Emulator wird eingeblendet, wenn ein Spiel gestartet wird -->
      <div v-if="isGameRunning" class="emulator-overlay">
        <div class="emulator-container">
          <div class="title-bar">
            {{ selectedGame.title }} läuft...
            <button class="close-button small" @click="closeGame">×</button>
          </div>
          <div id="emulator-display"></div>
          <div class="emulator-controls">
            <button class="amiga-button small" @click="resetGame">Neustarten</button>
            <button class="amiga-button small" @click="togglePause">
              {{ isPaused ? 'Fortsetzen' : 'Pause' }}
            </button>
            <button class="amiga-button small" @click="toggleFullscreen">Vollbild</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gamesData } from '../assets/data/games.js';

export default {
  name: 'GamesWindow',
  props: {
    // Die Komponente kann ein vorausgewähltes Spiel verarbeiten
    preSelectedGame: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      availableGames: gamesData,
      selectedGame: null,
      isGameRunning: false,
      isPaused: false,
      emulator: null
    };
  },
  created() {
    // Wenn ein Spiel vorausgewählt wurde, wähle es aus
    if (this.preSelectedGame) {
      this.selectedGame = this.preSelectedGame;
    }
  },
  methods: {
    selectGame(game) {
      this.selectedGame = game;
    },
    
    launchGame() {
      if (!this.selectedGame) return;
      
      this.isGameRunning = true;
      this.isPaused = false;
      
      // Warte kurz, damit der DOM aktualisiert werden kann
      this.$nextTick(() => {
        this.initializeEmulator();
      });
    },
    
    closeGame() {
      if (this.emulator) {
        this.emulator.shutdown();
        this.emulator = null;
      }
      this.isGameRunning = false;
    },
    
    resetGame() {
      if (this.emulator) {
        this.emulator.reset();
      }
    },
    
    togglePause() {
      if (!this.emulator) return;
      
      if (this.isPaused) {
        this.emulator.start();
      } else {
        this.emulator.pause();
      }
      
      this.isPaused = !this.isPaused;
    },
    
    toggleFullscreen() {
      const display = document.getElementById('emulator-display');
      
      if (!document.fullscreenElement) {
        if (display.requestFullscreen) {
          display.requestFullscreen();
        } else if (display.mozRequestFullScreen) {
          display.mozRequestFullScreen();
        } else if (display.webkitRequestFullscreen) {
          display.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    },
    
    initializeEmulator() {
      // Dynamisches Laden des Emulator-Skripts
      if (!window.EJS_player) {
        const scriptConfig = document.createElement('script');
        scriptConfig.innerHTML = `
          EJS_player = '#emulator-display';
          EJS_gameUrl = '${this.selectedGame.adfPath}';
          EJS_core = 'uae';
          EJS_pathtodata = '/js/emulatorjs/data/';
          EJS_biosUrl = '/roms/kick13.rom';
        `;
        document.head.appendChild(scriptConfig);
        
        const scriptUI = document.createElement('script');
        scriptUI.src = '/js/emulatorjs/emulator-ui.js';
        document.head.appendChild(scriptUI);
        
        const scriptEmulator = document.createElement('script');
        scriptEmulator.src = '/js/emulatorjs/emulator.js';
        document.head.appendChild(scriptEmulator);
        
        console.log('Emulator wird geladen für:', this.selectedGame.title);
      }
    }
  },
  beforeUnmount() {
    if (this.emulator) {
      this.emulator.shutdown();
    }
  }
}
</script>

<style scoped>
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  margin: 15px 0;
}

.game-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--text-dark);
  background-color: var(--window-gray);
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.game-card.selected {
  border: 2px solid var(--window-blue);
}

.game-icon {
  height: 120px;
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid var(--text-dark);
}

.game-info {
  padding: 8px;
  font-size: 12px;
}

.game-info strong {
  display: block;
  margin-bottom: 4px;
  color: var(--window-blue);
}

.game-details {
  margin-top: 20px;
}

.amiga-button {
  margin-top: 15px;
  padding: 6px 12px;
  background-color: var(--window-gray);
  border: 2px solid var(--text-dark);
  border-radius: 3px;
  color: var(--text-dark);
  font-family: 'Topaz', 'Courier New', monospace;
  cursor: pointer;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
}

.amiga-button:hover {
  background-color: var(--window-blue);
  color: var(--text-light);
}

.amiga-button.small {
  padding: 3px 8px;
  font-size: 12px;
}

.emulator-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.emulator-container {
  width: 90%;
  max-width: 800px;
  background-color: var(--window-gray);
  border: 2px solid var(--text-dark);
  border-radius: 5px;
  overflow: hidden;
}

#emulator-display {
  width: 100%;
  height: 480px;
  background-color: #000;
}

.emulator-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background-color: var(--window-gray);
}

.title-bar {
  background-color: var(--window-blue);
  color: var(--text-light);
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button.small {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--text-light);
  cursor: pointer;
}

/* Für die Games-Icon im Fenstertitel */
.games-icon:after {
  content: "G";
  position: absolute;
  top: 1px;
  left: 4px;
  color: var(--window-blue);
  font-weight: bold;
}
</style>
