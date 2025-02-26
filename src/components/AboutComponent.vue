<template>
  <div class="about-component">
    <h1>{{ data.title }}</h1>
    <h2>{{ data.subtitle }}</h2>
    <div class="about-content">
      <p>{{ data.content }}</p>
      <div class="about-actions">
        <a href="https://github.com/ogerly" target="_blank" class="about-link">GitHub</a>
        <a href="https://imsumpf.blogspot.com" target="_blank" class="about-link">Blog</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutComponent',
  props: {
    data: {
      type: Object,
      default: () => ({
        title: 'About',
        subtitle: 'Information',
        content: 'Default content'
      })
    }
  }
}
</script>

<style scoped>
.about-component {
  padding: 10px;
}

h1 {
  font-size: 18px;
  margin-top: 0;
  color: var(--window-blue);
}

h2 {
  font-size: 16px;
  margin-top: 5px;
  color: var(--text-dark);
}

.about-content {
  margin-top: 20px;
  line-height: 1.5;
}

.about-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.about-link {
  display: inline-block;
  padding: 5px 10px;
  background-color: var(--window-blue);
  color: white;
  text-decoration: none;
  border: 1px solid var(--text-dark);
}

.about-link:hover {
  background-color: var(--window-active-blue);
}
</style>
