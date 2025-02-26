<template>
  <div class="skills-component">
    <div class="skills-grid">
      <div v-for="(category, index) in data.skills" :key="index" class="skill-category">
        <h3>{{ category.name }}</h3>
        <ul class="skill-list">
          <li v-for="(item, i) in category.items" :key="i">{{ item }}</li>
        </ul>
      </div>
    </div>

    <div class="text-content">
      <h3>Meine Expertise und Leidenschaften</h3>
      <p>
        Ich bin nicht nur Entwickler, sondern auch Problemlöser und Innovator.
        Meine Stärke liegt in der Entwicklung von Web- und Desktopanwendungen, die
        funktional und ästhetisch überzeugen.
      </p>
      <p>
        Besonders stolz bin ich auf meine Arbeit mit dezentralen Technologien, KI
        und Open-Source-Projekten. Ich bin überzeugt, dass die Zukunft der Software
        in der Dezentralisierung liegt. Deshalb arbeite ich mit Protokollen wie
        Nostr und IPFS, um unabhängige und robuste Anwendungen zu entwickeln.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkillsComponent',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.skill-list {
  list-style-type: none;
  padding: 0;
}

.skill-list li {
  margin: 5px 0;
  padding: 3px 0;
  position: relative;
  padding-left: 15px;
}

.skill-list li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--window-blue);
}
</style>
