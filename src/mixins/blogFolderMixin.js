import { useWindowStore } from '../stores/windowStore';
import { useBlogStore } from '../stores/blogStore';

export function useBlogFolderMixin() {
  const windowStore = useWindowStore();
  const blogStore = useBlogStore();

  console.log('Blog Folder Mixin wird initialisiert');
  
  // Blog folder window dragging
  const startDragBlogFolder = (event) => {
    if (!windowStore.windows || !windowStore.windows['blog-folder']) {
      console.error('Blog folder window not found in windowStore');
      return;
    }
    windowStore.startDrag(event, 'blog-folder');
  };
  
  const maximizeBlogFolder = () => {
    windowStore.maximizeWindow('blog-folder');
  };
  
  const closeBlogFolder = () => {
    windowStore.closeBlogFolder();
  };
  
  // Additional Blog folder window dragging
  const startDragAdditionalBlogFolder = (event) => {
    if (!windowStore.windows || !windowStore.windows['additional-blog-folder']) {
      console.error('Additional blog folder window not found in windowStore');
      return;
    }
    windowStore.startDrag(event, 'additional-blog-folder');
  };
  
  const maximizeAdditionalBlogFolder = () => {
    windowStore.maximizeWindow('additional-blog-folder');
  };
  
  const closeAdditionalBlogFolder = () => {
    windowStore.closeAdditionalBlogFolder();
  };
  
  // Blog post actions
  const openBlogPost = (url) => {
    window.open(url, '_blank');
  };
  
  const openBlogWebsite = () => {
    window.open('https://imsumpf.blogspot.com', '_blank');
  };
  
  return {
    blogStore,
    startDragBlogFolder,
    maximizeBlogFolder,
    closeBlogFolder,
    startDragAdditionalBlogFolder,
    maximizeAdditionalBlogFolder,
    closeAdditionalBlogFolder,
    openBlogPost,
    openBlogWebsite
  };
}
