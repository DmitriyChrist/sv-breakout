// src/lib/game/gameStore.svelte.ts

type GameUIState = {
  gameOver: boolean;
  win: boolean;
  paused: boolean;
  lives: number;
  score: number;
};

export const uiState = $state<GameUIState>({
  gameOver: false,
  win: false,
  paused: false,
  lives: 3,
  score: 0,
});

export const gameStore = {
  incrementScore(p: number) { uiState.score += p; },
  decrementLives() {
    uiState.lives--;
    if (uiState.lives <= 0) { uiState.gameOver = true; uiState.win = false; }
  },
  togglePause() { uiState.paused = !uiState.paused; },
  reset() {
    uiState.gameOver = false;
    uiState.win = false;
    uiState.paused = false;
    uiState.lives = 3;
    uiState.score = 0;
  },
  checkWin(bricks: { status: number }[]) {
    if (bricks.every(b => b.status === 0)) {
      uiState.win = true; uiState.gameOver = true; return true;
    }
    return false;
  },
};

// // Простой способ обновлять UI - колбек функция
// let updateCallback: (() => void) | null = null;
//
// export const gameStore = {
//   getState() { return state; },
//
//   setGameOver(value: boolean) {
//     state.gameOver = value;
//     updateCallback?.();
//   },
//   setWin(value: boolean) {
//     state.win = value;
//     updateCallback?.();
//   },
//   setPaused(value: boolean) {
//     state.paused = value;
//     updateCallback?.();
//   },
//   setLives(value: number) {
//     state.lives = value;
//     updateCallback?.();
//   },
//   setScore(value: number) {
//     state.score = value;
//     updateCallback?.();
//   },
//
//   incrementScore(points: number) {
//     state.score += points;
//     updateCallback?.();
//   },
//
//   decrementLives() {
//     state.lives--;
//     if (state.lives <= 0) {
//       state.gameOver = true;
//       state.win = false;
//     }
//     updateCallback?.();
//   },
//
//   reset() {
//     state = {
//       gameOver: false,
//       win: false,
//       paused: false,
//       lives: 3,
//       score: 0
//     };
//     updateCallback?.();
//   },
//
//   togglePause() {
//     state.paused = !state.paused;
//     updateCallback?.();
//   },
//
//   checkWin(bricks: { status: number }[]) {
//     const allDestroyed = bricks.every(brick => brick.status === 0);
//     if (allDestroyed) {
//       state.win = true;
//       state.gameOver = true;
//       updateCallback?.();
//       return true;
//     }
//     return false;
//   },
//
//   // Метод для подписки на обновления
//   onUpdate(callback: () => void) {
//     updateCallback = callback;
//   }
// };
