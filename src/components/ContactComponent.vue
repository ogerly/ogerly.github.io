<template>
  <div class="contact-component">
    <div class="text-content">
      <h3>Kontaktieren Sie mich</h3>
      <p>
        Sie möchten mehr über meine Projekte erfahren, eine Zusammenarbeit
        besprechen oder einfach Hallo sagen? Ich freue mich über Ihre Nachricht!
      </p>

      <div class="contact-links">
        <div v-for="(link, index) in data.links" :key="index" class="contact-link">
          <div class="link-icon"></div>
          <a :href="link.url" target="_blank">{{ link.name }}: {{ link.url }}</a>
        </div>
      </div>

      <div class="contact-message">
        <p>
          Lass uns zusammenarbeiten! Wenn du einen Entwickler suchst, der technisch
          stark ist und eine Vision für die Zukunft hat, dann bin ich dein Mann.
          Schau dir meine Projekte auf GitHub an oder melde dich direkt bei mir.
          Ich freue mich darauf, zu hören, wie wir zusammen etwas Großartiges schaffen können!
        </p>
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
      required: true
    }
  }
}
</script>

<style scoped>
.contact-component {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-links {
  margin: 15px 0;
  background-color: #eee;
  padding: 10px;
  border: 1px solid #999;
}

.contact-link {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.link-icon {
  width: 16px;
  height: 16px;
  background-color: var(--window-blue);
  margin-right: 10px;
}

.contact-links a {
  color: var(--window-blue);
  text-decoration: none;
}

.contact-links a:hover {
  text-decoration: underline;
}

.contact-message {
  background-color: #ffe;
  padding: 10px;
  border: 1px solid #dd8;
  margin-top: 15px;
  font-style: italic;
}
</style>
