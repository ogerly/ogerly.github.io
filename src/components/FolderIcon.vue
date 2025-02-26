<template>
  <div class="folder-icon" @click="$emit('click')">
    <div class="folder-icon-graphic">
      <!-- Amiga-Style Disk/Ordner Icon -->
      <div class="folder-top"></div>
      <div class="folder-body"></div>
      <div class="folder-label">{{ label }}</div>
    </div>
    <span class="folder-name">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'FolderIcon',
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.folder-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 80px;
  text-align: center;
  margin-bottom: 15px;
}

.folder-icon-graphic {
  position: relative;
  width: 50px;
  height: 40px;
  margin-bottom: 5px;
}

.folder-top {
  position: absolute;
  top: 0;
  width: 50px;
  height: 10px;
  background-color: var(--folder-yellow);
  border: 1px solid var(--text-dark);
  border-radius: 3px 3px 0 0;
}

.folder-body {
  position: absolute;
  bottom: 0;
  width: 50px;
  height: 35px;
  background-color: var(--folder-yellow);
  border: 1px solid var(--text-dark);
  border-radius: 3px;
}

.folder-label {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: bold;
  color: var(--text-dark);
}

.folder-name {
  background-color: var(--workbench-blue);
  color: var(--text-light);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 12px;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.4);
}

.folder-icon:hover .folder-body {
  transform: translateY(-2px);
  box-shadow: 0 3px 5px rgba(0,0,0,0.2);
}
</style>
