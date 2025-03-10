<template>
  <div class="blog-window">
    <div class="loading-overlay" v-if="blogStore.loading">
      <div class="amiga-loading">
        <p>Loading Blog...</p>
        <div class="amiga-progress-bar">
          <div :style="{ width: blogStore.loadingProgress + '%' }" class="amiga-progress"></div>
        </div>
      </div>
    </div>
    
    <div v-else class="blog-content">
      <div class="blog-header">
        <h1>{{ blogStore.blogData.title }}</h1>
        <p class="blog-description">{{ blogStore.blogData.description }}</p>
      </div>
      
      <div class="blog-posts">
        <div v-for="(post, index) in blogStore.blogData.posts" :key="index" class="blog-post">
          <div class="post-header">
            <h2 class="post-title">{{ post.title }}</h2>
            <span class="post-date">{{ post.pubDate }}</span>
          </div>
          
          <div class="post-content">
            <div v-if="post.imageUrl" class="post-image">
              <img :src="post.imageUrl" :alt="post.title" />
            </div>
            <p class="post-excerpt">{{ post.description }}</p>
          </div>
          
          <div class="post-actions">
            <a :href="post.link" target="_blank" class="amiga-button-primary">Read More</a>
          </div>
          
          <div class="post-divider"></div>
        </div>
      </div>
      
      <div class="blog-footer">
        <button @click="refreshBlog" class="amiga-button-primary refresh-button">
          Refresh Blog
        </button>
        <a href="https://imsumpf.blogspot.com/" target="_blank" class="amiga-button-secondary">
          Visit Full Blog
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useBlogStore } from '../stores/blogStore';

export default {
  name: 'BlogWindow',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const blogStore = useBlogStore();
    
    const refreshBlog = () => {
      blogStore.loadBlogData(true); // Force refresh
    };
    
    onMounted(() => {
      // Check if blog data is already loaded or being loaded
      if (!blogStore.loading && blogStore.blogData.posts.length === 0) {
        blogStore.loadBlogData();
      }
    });
    
    return {
      blogStore,
      refreshBlog
    };
  }
};
</script>

<style scoped>
.blog-window {
  height: 100%;
  position: relative;
  background-color: white;
  overflow-y: auto;
  font-family: 'Topaz', 'Courier New', monospace;
  color: var(--text-dark);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.amiga-loading {
  text-align: center;
  width: 80%;
}

.amiga-progress-bar {
  width: 100%;
  height: 20px;
  background-color: var(--window-gray);
  border: 1px solid var(--text-dark);
  margin-top: 10px;
}

.amiga-progress {
  height: 100%;
  background-color: var(--window-blue);
  transition: width 0.3s ease;
}

.blog-content {
  padding: 15px;
}

.blog-header {
  margin-bottom: 20px;
  border-bottom: 2px solid var(--window-blue);
  padding-bottom: 10px;
}

.blog-header h1 {
  margin: 0;
  color: var(--window-blue);
  font-size: 20px;
}

.blog-description {
  margin-top: 5px;
  font-size: 14px;
  opacity: 0.8;
}

.blog-posts {
  margin-bottom: 20px;
}

.blog-post {
  margin-bottom: 25px;
}

.post-header {
  margin-bottom: 10px;
}

.post-title {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: var(--text-dark);
}

.post-date {
  font-size: 12px;
  opacity: 0.7;
}

.post-content {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.post-image {
  flex: 0 0 150px;
}

.post-image img {
  max-width: 100%;
  height: auto;
  border: 1px solid var(--text-dark);
}

.post-excerpt {
  flex: 1;
  min-width: 200px;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.post-actions {
  margin-top: 10px;
}

.post-divider {
  height: 1px;
  background-color: var(--window-gray);
  margin: 20px 0;
}

.blog-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--window-gray);
}

.amiga-button-primary {
  display: inline-block;
  padding: 5px 15px;
  background-color: var(--window-blue);
  color: white;
  border: 2px solid var(--text-dark);
  cursor: pointer;
  font-family: 'Topaz', 'Courier New', monospace;
  text-decoration: none;
}

.amiga-button-secondary {
  display: inline-block;
  padding: 5px 15px;
  background-color: var(--window-gray);
  color: var(--text-dark);
  border: 2px solid var(--text-dark);
  cursor: pointer;
  font-family: 'Topaz', 'Courier New', monospace;
  text-decoration: none;
}

@media (max-width: 600px) {
  .post-content {
    flex-direction: column;
  }
  
  .post-image {
    flex: 0 0 auto;
    text-align: center;
  }
}

.refresh-button {
  margin-right: 10px;
}
</style>
