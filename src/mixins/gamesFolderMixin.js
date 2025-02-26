import { useWindowStore } from '../stores/windowStore';
import { gamesData } from '../assets/data/games.js';

export function useGamesFolderMixin() {
  const windowStore = useWindowStore();
  
  // Starte das Drag von Games-Ordner
  const startDragGamesFolder = (event) => {
    windowStore.startDrag('games-folder', event);
  };
  
  // Maximieren/Wiederherstellen des Games-Ordnerfensters
  const maximizeGamesFolder = () => {
    windowStore.maximizeFolderWindow('games-folder');
  };
  
  // Schließen des Games-Ordnerfensters
  const closeGamesFolder = () => {
    windowStore.isGamesFolderOpen = false;
  };
  
  // Öffnen des Games-Ordnerfensters
  const openGamesFolder = () => {
    windowStore.openGamesFolder();
  };
  
  // Spiel starten
  const launchGame = (game) => {
    windowStore.launchGame(game);
  };
  
  return {
    startDragGamesFolder,
    maximizeGamesFolder,
    closeGamesFolder,
    openGamesFolder,
    launchGame,
    gamesData
  };
}
