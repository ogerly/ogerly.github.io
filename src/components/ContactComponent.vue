<template>
  <div class="contact-component">
    <h2>Kontaktiere mich</h2>
    <div class="contact-info">
      <p>Für Projektanfragen und Zusammenarbeit:</p>
      <div class="contact-links">
        <a v-for="link in data.links" :key="link.name" :href="link.url" target="_blank" class="contact-link">
          {{ link.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactComponent',
  props: {
    data: {
      type: Object,
      default: () => ({
        links: [
          { name: 'Blog', url: 'https://imsumpf.blogspot.com' },
          { name: 'GitHub', url: 'https://github.com/ogerly' }
        ]
      })
    }
  }
}
</script>

<style scoped>
.contact-component {
  padding: 15px;
  text-align: center;
}

h2 {
  margin-top: 0;
  color: var(--window-blue);
  font-size: 18px;
  margin-bottom: 20px;
}

.contact-info {
  background-color: white;
  padding: 20px;
  border: 1px solid var(--text-dark);
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.contact-link {
  display: inline-block;
  padding: 8px 15px;
  background-color: var(--window-blue);
  color: white;
  text-decoration: none;
  border: 1px solid var(--text-dark);
  font-weight: bold;
}

.contact-link:hover {
  background-color: var(--window-active-blue);
}
</style>
