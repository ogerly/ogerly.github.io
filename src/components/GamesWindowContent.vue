<template>
  <div class="games-window-content">
    <div v-if="!selectedGame" class="game-selector">
      <p class="select-game-message">Please select a game from the Games folder.</p>
      <button @click="openGamesFolder" class="amiga-button">
        Open Games Folder
      </button>
    </div>
    
    <div v-else class="game-player">
      <div class="game-info">
        <h3>{{ selectedGame.title }}</h3>
        <p>{{ selectedGame.description }}</p>
      </div>
      
      <div class="game-emulator">
        <!-- Emulator content goes here based on selected game -->
        <div class="emulator-placeholder">
          <img :src="selectedGame.screenshot" :alt="selectedGame.title" class="game-screenshot" />
          <p>Game emulation would load here</p>
        </div>
      </div>
      
      <div class="game-controls">
        <button class="amiga-button">Start Game</button>
        <button class="amiga-button" @click="backToGameSelection">Back to Selection</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useWindowStore } from '../stores/windowStore';

export default {
  name: 'GamesWindowContent',
  props: {
    selectedGame: {
      type: Object,
      default: null
    }
  },
  setup() {
    const windowStore = useWindowStore();
    
    const openGamesFolder = () => {
      windowStore.openGamesFolder();
    };
    
    const backToGameSelection = () => {
      windowStore.selectedGame = null;
    };
    
    return {
      openGamesFolder,
      backToGameSelection
    };
  }
}
</script>

<style scoped>
.games-window-content {
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.game-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
}

.select-game-message {
  margin-bottom: 20px;
  font-size: 16px;
}

.game-player {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game-info {
  margin-bottom: 15px;
}

.game-info h3 {
  margin: 0 0 10px 0;
  color: var(--window-blue);
}

.game-emulator {
  flex: 1;
  min-height: 240px;
  border: 2px solid var(--text-dark);
  background-color: #000;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
}

.emulator-placeholder {
  text-align: center;
}

.game-screenshot {
  max-width: 100%;
  max-height: 240px;
  margin-bottom: 10px;
  border: 1px solid #333;
}

.game-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.amiga-button {
  background-color: var(--window-blue);
  color: white;
  border: 2px solid var(--text-dark);
  padding: 6px 12px;
  font-family: 'Topaz', 'Courier New', monospace;
  cursor: pointer;
}

.amiga-button:hover {
  background-color: #0066cc;
}
</style>
