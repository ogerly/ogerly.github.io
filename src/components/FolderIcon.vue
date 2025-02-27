<template>
  <div class="folder-icon-container" @click="handleClick">
    <div class="folder-icon-visual">
      <div class="folder-front" :class="{ 'blog-folder': type === 'blog' }"></div>
      <div class="folder-back" :class="{ 'blog-folder': type === 'blog' }"></div>
    </div>
    <span class="folder-label">{{ label }}</span>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'FolderIcon',
  props: {
    label: {
      type: String,
      default: 'Folder'
    },
    type: {
      type: String, // 'games', 'blog' usw.
      default: 'default'
    }
  },
  setup(props, { emit }) {
    const handleClick = () => {
      console.log(`FolderIcon ${props.label} (Typ: ${props.type}) wurde geklickt`);
      emit('click');
    };
    
    return {
      handleClick
    };
  }
}
</script>

<style scoped>
.folder-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  width: 70px;
  cursor: pointer;
  pointer-events: auto;
}

.folder-icon-visual {
  position: relative;
  width: 60px;
  height: 50px;
  margin-bottom: 5px;
}

.folder-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 45px;
  background-color: var(--window-blue);
  border: 1px solid var(--text-dark);
  border-radius: 2px;
  z-index: 1;
}

.folder-front {
  position: absolute;
  top: 5px;
  left: 0;
  width: 60px;
  height: 40px;
  background-color: var(--window-blue);
  border: 1px solid var(--text-dark);
  z-index: 2;
}

.folder-label {
  text-align: center;
  font-size: 12px;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7);
}

/* Spezielles Styling für Blog-Ordner */
.blog-folder {
  background-color: #775533; /* Braun für Blog */
}

/* Animation beim Hover */
.folder-icon-container:hover .folder-front,
.folder-icon-container:hover .folder-back {
  filter: brightness(1.2);
}
</style>
