<template>
  <div class="games-window window">
    <div class="window-title">
      <div class="title-icon game-icon"></div>
      <span>{{ currentGame ? currentGame.title : 'Amiga Game' }}</span>
      <div class="window-controls">
        <button @click="$emit('maximize')" class="zoom-button"></button>
        <button @click="$emit('close')" class="close-button"></button>
      </div>
    </div>
    <div class="window-content">
      <div class="title-bar blue-bar">
        {{ currentGame ? currentGame.title : 'Game Emulation' }}
      </div>
      <div class="game-container">
        <div v-if="currentGame" class="game-description">
          <h3>{{ currentGame.title }}</h3>
          <p>{{ currentGame.description }}</p>
          <div class="game-placeholder">
            <img v-if="currentGame.imageUrl" :src="currentGame.imageUrl" :alt="currentGame.title" 
                 @error="usePlaceholderImage">
            <div v-else class="game-placeholder-text">Game Screen</div>
          </div>
        </div>
        <div v-else class="game-select">
          <p>Bitte wähle ein Spiel aus dem Games-Ordner.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useWindowStore } from '../stores/windowStore';

export default {
  name: 'GamesWindow',
  emits: ['close', 'maximize'],
  setup() {
    const windowStore = useWindowStore();
    const currentGame = computed(() => windowStore.selectedGame);
    
    const usePlaceholderImage = (event) => {
      event.target.src = `https://placehold.co/300x200/333333/ffffff?text=${currentGame.value?.title || 'Game'}`;
    };
    
    return {
      currentGame,
      usePlaceholderImage
    };
  }
}
</script>

<style scoped>
.games-window {
  width: 500px;
  height: 400px;
}

.game-container {
  padding: 15px;
  overflow: auto;
  height: 100%;
}

.game-description {
  text-align: center;
}

.game-description h3 {
  margin-top: 0;
  color: var(--window-blue);
}

.game-placeholder {
  margin: 20px 0;
  background-color: #333;
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-placeholder img {
  max-width: 100%;
  max-height: 200px;
}

.game-placeholder-text {
  color: white;
  font-size: 18px;
}

.game-select {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}
</style>
