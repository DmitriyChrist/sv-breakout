<script lang="ts">
  // Path to file: src/lib/game/Game.svelte
  import { onMount, getContext } from "svelte";
  import { GAME_KEY, type GameState } from "./context";
  import { gameStore } from "./gameStore";
  import { setupKeyboard, setupTouch } from "./input";
  import GameLoop from "./GameLoop.svelte";

  const gameState = getContext<GameState>(GAME_KEY);

  // Локальные переменные для отображения
  let gameOver = false;
  let win = false;
  let paused = false;
  let score = 0;
  let lives = 3;

  // Функция для обновления локальных переменных
  function updateUI() {
    const state = gameStore.getState();
    gameOver = state.gameOver;
    win = state.win;
    paused = state.paused;
    score = state.score;
    lives = state.lives;
  }

  // Подписываемся на обновления
  onMount(() => {
    gameStore.onUpdate(() => {
      updateUI();
    });

    if (gameState) {
      const cleanupKeyboard = setupKeyboard(gameState.input);
      const cleanupTouch = setupTouch(
        gameState.ctx.canvas,
        gameState.paddle,
        gameState.canvas.width,
      );

      return () => {
        cleanupKeyboard();
        cleanupTouch();
        // Не отписываемся - это проще
      };
    }
  });

  // Инициализируем UI
  updateUI();

  function handleRestart() {
    gameStore.reset();
    updateUI();

    if (gameState) {
      gameState.bricks.forEach((brick) => (brick.status = 1));
      gameState.ball.x = gameState.canvas.width / 2;
      gameState.ball.y = gameState.canvas.height - 35;
      gameState.ball.dx = 2;
      gameState.ball.dy = -2;
      gameState.paddle.x =
        (gameState.canvas.width - gameState.paddle.size.width) / 2;
    }
  }
</script>

<!-- остальной код без изменений -->
<div class="game-container">
  {#if gameState}
    {#if !gameOver}
      <div class="game-controls">
        <button
          on:click={() => {
            gameStore.togglePause();
            updateUI();
          }}
          class="pause-btn"
        >
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
        <div class="game-stats">
          <span class="score">Score: {score}</span>
          <span class="lives">Lives: {lives}</span>
        </div>
      </div>

      <GameLoop {gameState} />
    {:else}
      <div class="game-over">
        <h2>{win ? "🎉 You Win!" : "💀 Game Over!"}</h2>
        <p class="score">Final Score: {score}</p>
        <button on:click={handleRestart} class="restart-btn">
          Play Again
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .game-container {
    position: relative;
    width: 480px;
    height: 320px;
    margin: 0 auto;
  }

  .game-controls {
    position: absolute;
    top: -40px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }

  .pause-btn {
    padding: 8px 16px;
    background: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
  }

  .pause-btn:hover {
    background: #1976d2;
  }

  .game-stats {
    display: flex;
    gap: 20px;
    color: #333;
    font-weight: bold;
  }

  .score {
    color: #4caf50;
  }

  .lives {
    color: #f44336;
  }

  .game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 2.5rem;
    border-radius: 12px;
    text-align: center;
    z-index: 100;
    min-width: 300px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .game-over h2 {
    margin: 0 0 1rem 0;
    font-size: 2rem;
    color: #ffd700;
  }

  .game-over .score {
    font-size: 1.5rem;
    margin: 1rem 0;
    color: #4caf50;
  }

  .restart-btn {
    margin-top: 1.5rem;
    padding: 12px 24px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.2s;
  }

  .restart-btn:hover {
    background: #45a049;
    transform: scale(1.05);
  }
</style>
