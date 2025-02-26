import { defineStore } from 'pinia';
import { useWindowStore } from './windowStore';
import { useSystemStore } from './systemStore';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    activeMenu: null,
  }),
  
  actions: {
    toggleMenu(menuName) {
      if (this.activeMenu === menuName) {
        this.activeMenu = null;
      } else {
        this.activeMenu = menuName;
      }
    },
    
    handleOutsideClick(event) {
      if (this.activeMenu && !event.target.closest('.menu-items') && !event.target.closest('.dropdown-menu')) {
        this.activeMenu = null;
      }
    },
    
    menuAction(action) {
      const windowStore = useWindowStore();
      const systemStore = useSystemStore();
      
      switch (action) {
        case 'about':
        case 'skills':
        case 'projects':
        case 'contact':
        case 'terminal':
        case 'blog':
        case 'nostr':
          windowStore.toggleWindow(action);
          break;
        case 'reboot':
          windowStore.resetAllWindows();
          systemStore.rebootSystem();
          break;
        default:
          console.log(`Menu action ${action} not implemented`);
      }
      
      // Menü schließen nach der Aktion
      this.activeMenu = null;
    }
  }
});
