<template>
  <div class="projects-component">
    <div v-for="(project, index) in data.projects" :key="index" class="project-card">
      <h2>{{ project.name }}</h2>
      <p>{{ project.desc }}</p>
      <a v-if="project.url" :href="project.url" target="_blank" class="project-link">Details</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectsComponent',
  props: {
    data: {
      type: Object,
      default: () => ({
        projects: [
          { name: 'Projekt 1', desc: 'Beschreibung 1' },
          { name: 'Projekt 2', desc: 'Beschreibung 2' }
        ]
      })
    }
  }
}
</script>

<style scoped>
.projects-component {
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.project-card {
  background-color: var(--window-gray);
  padding: 15px;
  border: 1px solid var(--text-dark);
}

h2 {
  margin-top: 0;
  color: var(--window-blue);
  font-size: 16px;
}

.project-link {
  display: inline-block;
  margin-top: 10px;
  padding: 3px 8px;
  background-color: var(--window-blue);
  color: white;
  text-decoration: none;
  border: 1px solid var(--text-dark);
}
</style>
