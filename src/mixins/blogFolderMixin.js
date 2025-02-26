import { useWindowStore } from '../stores/windowStore';
import { useBlogStore } from '../stores/blogStore';

export function useBlogFolderMixin() {
  const windowStore = useWindowStore();
  const blogStore = useBlogStore();
  
  // Starte das Drag von Blog-Ordner
  const startDragBlogFolder = (event) => {
    windowStore.startDrag('blog-folder', event);
  };
  
  // Maximieren/Wiederherstellen des Blog-Ordnerfensters
  const maximizeBlogFolder = () => {
    if (!windowStore.isBlogFolderMaximized) {
      windowStore.blogFolderPreviousPosition = {...windowStore.blogFolderPosition};
      windowStore.isBlogFolderMaximized = true;
    } else {
      windowStore.blogFolderPosition = windowStore.blogFolderPreviousPosition;
      windowStore.isBlogFolderMaximized = false;
    }
  };
  
  // Schließen des Blog-Ordnerfensters
  const closeBlogFolder = () => {
    windowStore.isBlogFolderOpen = false;
  };
  
  // Starte das Drag vom zusätzlichen Blog-Ordner
  const startDragAdditionalBlogFolder = (event) => {
    windowStore.startDrag('additional-blog-folder', event);
  };
  
  // Maximieren/Wiederherstellen des zusätzlichen Blog-Ordnerfensters
  const maximizeAdditionalBlogFolder = () => {
    if (!windowStore.isAdditionalBlogFolderMaximized) {
      windowStore.additionalBlogFolderPreviousPosition = {...windowStore.additionalBlogFolderPosition};
      windowStore.isAdditionalBlogFolderMaximized = true;
    } else {
      windowStore.additionalBlogFolderPosition = windowStore.additionalBlogFolderPreviousPosition;
      windowStore.isAdditionalBlogFolderMaximized = false;
    }
  };
  
  // Schließen des zusätzlichen Blog-Ordnerfensters
  const closeAdditionalBlogFolder = () => {
    windowStore.isAdditionalBlogFolderOpen = false;
  };
  
  // Blog-Post öffnen (in neuem Tab)
  const openBlogPost = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };
  
  // Direktes Öffnen der Blog-Seite
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
