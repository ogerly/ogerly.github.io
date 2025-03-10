<template>
  <div class="blog-preview">
    <div class="blog-header">
      <img src="/logo-devmatrose.png" alt="DEVmatrose Logo" class="blog-logo" @error="useDefaultLogo" />
      <div class="blog-title">
        <h1>Willkommen bei DEVmatrose</h1>
        <p>Seit 1999 entwickle ich masgeschneiderte Softwarelösungen mit besonderem Fokus auf dezentrale Technologien.</p>
      </div>
    </div>
    
    <div class="blog-entries">
      <h2>Neueste Blog-Einträge</h2>
      
      <div v-if="blogStore.loading" class="blog-loading">
        <div class="blog-progress-bar">
          <div :style="{ width: blogStore.loadingProgress + '%' }" class="blog-progress"></div>
        </div>
        <p class="loading-text">Lade Blog-Einträge...</p>
      </div>
      
      <div v-else-if="blogStore.error" class="blog-error">
        Fehler beim Laden der Blog-Einträge.
        <button @click="refreshBlog" class="blog-retry-button">Erneut versuchen</button>
      </div>
      
      <div v-else-if="blogStore.blogData.posts.length === 0" class="blog-empty">
        Keine Blog-Einträge gefunden.
      </div>
      
      <div v-else class="blog-posts">
        <div v-for="(post, index) in blogPosts" :key="index" class="blog-post">
          <h3>{{ post.title }}</h3>
          <div class="blog-post-date">{{ post.pubDate }}</div>
          <p>{{ post.description }}</p>
          <a :href="post.link" target="_blank" class="blog-read-more">Mehr lesen...</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useBlogStore } from '../stores/blogStore';

export default {
  name: 'BlogPreview',
  setup() {
    const blogStore = useBlogStore();
    const logoSrc = ref('/logo-devmatrose.png');
    
    const useDefaultLogo = () => {
      logoSrc.value = 'https://placehold.co/100x100/2b65ad/ffffff?text=DEV';
    };
    
    const blogPosts = computed(() => {
      return blogStore.blogData.posts.slice(0, 3);
    });
    
    const refreshBlog = () => {
      blogStore.loadBlogData(true); // Force reload
    };
    
    onMounted(() => {
      // Check if blog data is already loaded or being loaded
      if (!blogStore.loading && blogStore.blogData.posts.length === 0) {
        blogStore.loadBlogData();
      }
    });
    
    return {
      blogStore,
      blogPosts,
      logoSrc,
      useDefaultLogo,
      refreshBlog
    };
  }
}
</script>

<style scoped>
.blog-preview {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Topaz', 'Courier New', monospace;
}

.blog-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.blog-logo {
  width: 80px;
  height: 80px;
  margin-right: 20px;
}

.blog-title h1 {
  margin: 0 0 10px 0;
  color: var(--window-blue);
  font-size: 24px;
}

.blog-title p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.blog-entries h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: var(--window-blue);
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--window-blue);
}

.blog-loading {
  padding: 20px;
}

.blog-progress-bar {
  height: 10px;
  background-color: var(--window-gray);
  border: 1px solid var(--text-dark);
}

.blog-progress {
  height: 100%;
  background-color: var(--window-blue);
  transition: width 0.3s ease;
}

.loading-text {
  margin-top: 10px;
  font-size: 14px;
}

.blog-error {
  padding: 20px;
}

.blog-retry-button {
  display: inline-block;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: var(--window-blue);
  color: white;
  border: 1px solid var(--text-dark);
  cursor: pointer;
  font-family: 'Topaz', 'Courier New', monospace;
  font-size: 12px;
}

.blog-posts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.blog-post {
  flex: 1;
  min-width: 300px;
  background: #fff;
  border: 1px solid var(--text-dark);
  padding: 15px;
}

.blog-post h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: var(--window-blue);
}

.blog-post-date {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.blog-post p {
  margin: 0 0 15px 0;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-read-more {
  display: inline-block;
  color: var(--window-blue);
  text-decoration: none;
  font-size: 12px;
  font-weight: bold;
}

.blog-read-more:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .blog-header {
    flex-direction: column;
    text-align: center;
  }
  
  .blog-logo {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .blog-posts {
    flex-direction: column;
  }
}
</style>
