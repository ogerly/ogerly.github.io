import { defineStore } from 'pinia';
import { fetchRssFeed } from '../utils/rssParser';

export const useBlogStore = defineStore('blog', {
  state: () => ({
    blogData: {
      title: "Im Sumpf Blog",
      description: "Loading blog posts...",
      posts: []
    },
    loading: true,
    loadingProgress: 0,
    error: null,
    feedUrl: 'https://imsumpf.blogspot.com/feeds/posts/default?alt=rss' // Korrekte URL ohne view-source:
  }),
  
  actions: {
    async loadBlogData() {
      this.loading = true;
      this.error = null;
      this.loadingProgress = 0;
      
      // Simulate progress
      const interval = setInterval(() => {
        this.loadingProgress += Math.floor(Math.random() * 10);
        if (this.loadingProgress >= 100) {
          this.loadingProgress = 100;
          clearInterval(interval);
        }
      }, 300);
      
      try {
        console.log('Starte Blog-Daten-Abruf...');
        const data = await fetchRssFeed(this.feedUrl);
        
        if (data.error) {
          this.error = data.error;
        } else {
          this.blogData = data;
          console.log(`Blog geladen: ${data.title}, ${data.posts.length} Einträge`);
        }
      } catch (error) {
        console.error("Failed to load blog:", error);
        this.error = error.message || "Unbekannter Fehler beim Laden des Blogs";
      } finally {
        // Ensure loading is complete
        this.loadingProgress = 100;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    },
    
    setFeedUrl(url) {
      this.feedUrl = url;
      this.loadBlogData(); // Lade Blog-Daten mit neuer URL
    }
  }
});
