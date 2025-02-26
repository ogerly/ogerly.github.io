<template>
  <div class="welcome-container">
    <div class="welcome-header">
      <!-- Logo mit berechneter URL -->
      <img :src="logoUrl" alt="DEVmatrose Logo" class="welcome-logo" onerror="this.onerror=null; this.src='https://placehold.co/100x100/2b65ad/ffffff?text=DEV';" />
      <h1>Willkommen bei DEVmatrose</h1>
    </div>
    
    <div class="welcome-intro">
      <p>
        Seit 1999 entwickle ich maßgeschneiderte Softwarelösungen mit besonderem 
        Fokus auf innovative und dezentrale Technologien. Diese Website im Retro-Amiga-Design 
        präsentiert meine Projekte und Fähigkeiten.
      </p>
      <div class="welcome-actions">
        <button @click="openWindow('about')" class="welcome-button">Über mich</button>
        <button @click="openWindow('projects')" class="welcome-button">Projekte</button>
        <button @click="openWindow('contact')" class="welcome-button">Kontakt</button>
      </div>
    </div>
    
    <!-- Blog-Vorschau -->
    <div class="blog-preview-section">
      <div class="preview-header">
        <h2>Neueste Blog-Einträge aus Im Sumpf</h2>
        <button @click="openWindow('blog')" class="welcome-button small">Alle Einträge</button>
      </div>
      
      <div v-if="blogStore.loading" class="preview-loading">
        <div class="loading-bar">
          <div :style="{ width: blogStore.loadingProgress + '%' }" class="loading-progress"></div>
        </div>
        <p class="loading-text">Lade Blog-Inhalte...</p>
      </div>
      
      <div v-else-if="blogStore.error" class="preview-error">
        <p>{{ blogStore.error }}</p>
      </div>
      
      <div v-else class="blog-posts-grid">
        <!-- Zeige nur die ersten 3 Blog-Posts an -->
        <div v-for="(post, index) in blogPosts" :key="index" class="blog-post-card">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-date">{{ post.pubDate }}</p>
          <div v-if="post.imageUrl" class="post-thumb">
            <img :src="post.imageUrl" :alt="post.title" />
          </div>
          <p class="post-excerpt">{{ post.description }}</p>
          <a :href="post.link" target="_blank" class="read-more">Weiterlesen →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useWindowStore } from '../stores/windowStore';
import { useBlogStore } from '../stores/blogStore';

export default {
  name: 'TheWelcome',
  setup() {
    const windowStore = useWindowStore();
    const blogStore = useBlogStore();
    
    // Zeige nur die ersten 3 Blog-Einträge
    const blogPosts = computed(() => {
      return blogStore.blogData.posts.slice(0, 3);
    });
    
    const openWindow = (name) => {
      windowStore.toggleWindow(name);
    };
    
    onMounted(() => {
      // Lade Blog-Daten beim Mounten der Komponente
      blogStore.loadBlogData();
    });
    
    // Hinzufügen der Logo-URL für bessere Flexibilität
    const logoUrl = computed(() => {
      // Versuche zunächst das Logo aus public/
      // Falls es nicht existiert, nutze placehold.co als Fallback
      return '/logo-devmatrose.png';
    });
    
    return {
      windowStore,
      blogStore,
      blogPosts,
      openWindow,
      logoUrl
    };
  }
}
</script>

<style scoped>
.welcome-container {
  padding: 20px;
  background-color: var(--window-gray);
  font-family: 'Topaz', 'Courier New', monospace;
  color: var(--text-dark);
  max-width: 1000px;
  margin: 0 auto;
}

.welcome-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--window-blue);
}

.welcome-logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
}

.welcome-header h1 {
  margin: 0;
  color: var(--window-blue);
  font-size: 22px;
}

.welcome-intro {
  background-color: white;
  border: 1px solid var(--text-dark);
  padding: 15px;
  margin-bottom: 25px;
}

.welcome-intro p {
  line-height: 1.6;
  margin-top: 0;
}

.welcome-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.welcome-button {
  padding: 6px 14px;
  background-color: var(--window-blue);
  color: white;
  border: 1px solid var(--text-dark);
  cursor: pointer;
  font-family: 'Topaz', 'Courier New', monospace;
}

.welcome-button.small {
  padding: 4px 10px;
  font-size: 12px;
}

.welcome-button:hover {
  background-color: #0055aa;
}

/* Blog Preview Styles */
.blog-preview-section {
  background-color: white;
  border: 1px solid var(--text-dark);
  padding: 15px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid var(--window-blue);
  padding-bottom: 8px;
}

.preview-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--window-blue);
}

.preview-loading {
  text-align: center;
  padding: 20px;
}

.loading-bar {
  height: 12px;
  background-color: #eee;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.loading-progress {
  height: 100%;
  background-color: var(--window-blue);
  transition: width 0.3s ease;
}

.preview-error {
  color: #cc0000;
  text-align: center;
  padding: 15px;
}

.blog-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.blog-post-card {
  border: 1px solid #ddd;
  padding: 12px;
  background-color: #f9f9f9;
}

.post-title {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: var(--window-blue);
}

.post-date {
  font-size: 12px;
  margin: 0 0 10px 0;
  opacity: 0.7;
}

.post-thumb {
  margin-bottom: 10px;
}

.post-thumb img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
}

.post-excerpt {
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more {
  display: inline-block;
  color: var(--window-blue);
  text-decoration: none;
  font-size: 13px;
  font-weight: bold;
}

.read-more:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .blog-posts-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-actions {
    flex-direction: column;
  }
}

/* Neuer Stil für Platzhalter-Logo */
.logo-placeholder {
  width: 50px;
  height: 50px;
  background-color: var(--window-blue);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 5px;
  margin-right: 15px;
  border: 1px solid var(--text-dark);
}
</style>
