<template>
  <div class="skills-component">
    <div v-for="(category, index) in data.skills" :key="index" class="skill-category">
      <h2>{{ category.name }}</h2>
      <ul class="skill-list">
        <li v-for="(item, itemIndex) in category.items" :key="itemIndex">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkillsComponent',
  props: {
    data: {
      type: Object,
      default: () => ({
        skills: [
          { name: 'Frontend', items: ['HTML', 'CSS', 'JavaScript'] },
          { name: 'Backend', items: ['Node.js', 'Python'] },
        ]
      })
    }
  }
}
</script>

<style scoped>
.skills-component {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.skill-category {
  flex: 1;
  min-width: 200px;
  background-color: var(--window-gray);
  padding: 10px;
  border: 1px solid var(--text-dark);
}

h2 {
  margin-top: 0;
  color: var(--window-blue);
  border-bottom: 1px solid var(--text-dark);
  padding-bottom: 5px;
  font-size: 16px;
}

.skill-list {
  list-style-type: square;
  padding-left: 20px;
}

.skill-list li {
  margin: 5px 0;
}
</style>
