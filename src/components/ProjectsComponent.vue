<template>
  <div class="projects-component">
    <div class="project-list">
      <div v-for="(project, index) in data.projects" :key="index" class="project-item">
        <div class="project-icon"></div>
        <div class="project-info">
          <h3>{{ project.name }}</h3>
          <p>{{ project.desc }}</p>
        </div>
      </div>
    </div>

    <div class="text-content">
      <h3>Meine GitHub Repositories</h3>
      <p>
        Mit über 60 öffentlichen Repositories teile ich gerne meine Arbeit mit der
        Community. Von Tools für die Datenanalyse bis hin zu experimentellen
        Frontend-Frameworks - jedes Projekt ist ein Ausdruck meiner Leidenschaft
        für sauberen, effizienten Code.
      </p>
      <div class="github-badge">
        <a href="https://github.com/ogerly" target="_blank">
          GitHub Profil besuchen
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectsComponent',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.project-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.project-item {
  background-color: #fff;
  border: 1px solid #000;
  padding: 10px;
  display: flex;
  align-items: center;
}

.project-icon {
  width: 24px;
  height: 24px;
  background-color: var(--window-blue);
  margin-right: 10px;
}

.project-info h3 {
  margin: 0 0 5px 0;
  color: var(--window-blue);
  font-size: 14px;
}

.project-info p {
  margin: 0;
  font-size: 12px;
}

.github-badge {
  background: var(--window-blue);
  padding: 8px;
  text-align: center;
  margin-top: 15px;
}

.github-badge a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}
</style>
