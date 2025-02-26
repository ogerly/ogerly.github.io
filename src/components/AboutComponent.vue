<template>
  <div class="about-component">
    <div class="text-content">
      <h2>{{ data.title }}</h2>
      <p><strong>{{ data.subtitle }}</strong></p>
      <div class="content-text">
        <p>{{ data.content }}</p>

        <h3>Mein Weg als Entwickler</h3>
        <p>
          Alles begann Ende der 90er, als das Internet noch jung war. Seitdem habe ich mich ständig weiterentwickelt,
          immer auf der Suche nach neuen Herausforderungen und Technologien, die die Art, wie wir Software nutzen
          und entwickeln, verändern können. Heute findest du das in meinen 60 GitHub-Repositories wieder –
          von KI-gestützten Tools über dezentrale Systeme bis hin zu kreativen Datenvisualisierungen.
        </p>

        <h3>Meine Fähigkeiten und mein Tech-Stack</h3>
        <p>
          Ich bin ein Full-Stack-Entwickler mit einem breiten Spektrum an Skills:
        </p>
        <ul class="skill-list">
          <li>Frontend: JavaScript, Vue.js, Nuxt, Vuetify</li>
          <li>Backend: Node.js, Python, PHP, MySQL, Neo4J</li>
          <li>Künstliche Intelligenz: Prompt Engineering, GPT-Modelle</li>
          <li>Blockchain und Web3: Bitcoin, Ethereum, Polkadot, Nostr</li>
        </ul>
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
      required: true
    }
  }
}
</script>

<style scoped>
.about-component {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.content-text {
  margin-top: 15px;
}

.content-text p {
  margin-bottom: 15px;
}

.content-text h3 {
  color: var(--window-blue);
  margin: 15px 0 10px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid var(--accent-magenta);
  padding-bottom: 2px;
}

.skill-list {
  list-style-type: none;
  padding: 0 0 0 15px;
}

.skill-list li {
  margin: 5px 0;
  position: relative;
  padding-left: 20px;
}

.skill-list li:before {
  content: "•";
  position: absolute;
  left: 5px;
  color: var(--window-blue);
  font-weight: bold;
}
</style>
