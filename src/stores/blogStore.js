import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchRssFeed } from '../utils/rssParser';

export const useBlogStore = defineStore('blog', () => {
  const blogData = ref({
    title: 'Im Sumpf Blog',
    description: 'Lade Blog-Einträge...',
    posts: []
  });
  
  const loading = ref(false);
  const loadingProgress = ref(0);
  const error = ref(null);
  const lastFetched = ref(null);
  const fetchAttempts = ref(0);
  
  // Cache time in milliseconds (5 minutes)
  const CACHE_TIME = 5 * 60 * 1000;
  // Maximum number of fetch attempts before using fallback
  const MAX_FETCH_ATTEMPTS = 3;
  
  const isCacheValid = computed(() => {
    if (!lastFetched.value) return false;
    return (Date.now() - lastFetched.value) < CACHE_TIME;
  });
  
  // Use local storage to cache the blog data
  function saveBlogToCache(data) {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem('blog_cache', JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Failed to save blog to localStorage:', e);
    }
  }
  
  function loadBlogFromCache() {
    try {
      const cacheJson = localStorage.getItem('blog_cache');
      if (!cacheJson) return null;
      
      const cache = JSON.parse(cacheJson);
      
      // Check if cache is still valid
      if (Date.now() - cache.timestamp < CACHE_TIME) {
        console.log('Using blog data from localStorage cache');
        return cache.data;
      } else {
        console.log('Cache expired, will fetch fresh data');
        return null;
      }
    } catch (e) {
      console.warn('Failed to load blog from localStorage:', e);
      return null;
    }
  }
  
  async function loadBlogData(forceRefresh = false) {
    // Return cached data if it's still valid and not forcing refresh
    if (!forceRefresh) {
      if (isCacheValid.value && blogData.value.posts.length > 0) {
        console.log('Using in-memory cached blog data');
        return blogData.value;
      }
      
      // Try to load from localStorage if available
      const cachedData = loadBlogFromCache();
      if (cachedData && !forceRefresh) {
        blogData.value = cachedData;
        lastFetched.value = Date.now();
        return cachedData;
      }
    }
    
    // Reset fetch attempts if forced refresh
    if (forceRefresh) {
      fetchAttempts.value = 0;
    }
    
    // If we've tried too many times, use fallback data
    if (fetchAttempts.value >= MAX_FETCH_ATTEMPTS) {
      console.warn(`Exceeded maximum fetch attempts (${MAX_FETCH_ATTEMPTS}), using fallback data`);
      return blogData.value;
    }
    
    fetchAttempts.value++;
    
    // Start loading
    loading.value = true;
    loadingProgress.value = 10;
    error.value = null;
    
    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        if (loadingProgress.value < 90) {
          loadingProgress.value += Math.floor(Math.random() * 10) + 5;
        }
      }, 200);
      
      // The RSS feed URL
      const rssFeedUrl = 'https://imsumpf.blogspot.com/feeds/posts/default?alt=rss';
      
      // Fetch data - will automatically use local proxy in DEV mode
      const data = await fetchRssFeed(rssFeedUrl);
      
      // Update state with fetched data
      blogData.value = data;
      lastFetched.value = Date.now();
      loadingProgress.value = 100;
      fetchAttempts.value = 0; // Reset attempts on success
      
      // Save to localStorage cache
      saveBlogToCache(data);
      
      // Clean up progress interval
      clearInterval(progressInterval);
      
      // Set loading to false after a slight delay to ensure progress bar shows completion
      setTimeout(() => {
        loading.value = false;
      }, 300);
      
      return data;
    } catch (e) {
      console.error('Failed to load blog data:', e);
      error.value = e.message || 'Fehler beim Laden der Blog-Daten';
      loadingProgress.value = 100;
      
      // Set loading to false after delay
      setTimeout(() => {
        loading.value = false;
      }, 300);
      
      return blogData.value;
    }
  }
  
  // Reset store (useful for testing)
  function resetStore() {
    blogData.value = {
      title: 'Im Sumpf Blog',
      description: 'Lade Blog-Einträge...',
      posts: []
    };
    loading.value = false;
    loadingProgress.value = 0;
    error.value = null;
    lastFetched.value = null;
    fetchAttempts.value = 0;
    
    // Clear localStorage cache
    try {
      localStorage.removeItem('blog_cache');
    } catch (e) {
      console.warn('Failed to clear localStorage cache:', e);
    }
  }
  
  return {
    blogData,
    loading,
    loadingProgress,
    error,
    loadBlogData,
    resetStore,
    isCacheValid,
    fetchAttempts
  };
});
