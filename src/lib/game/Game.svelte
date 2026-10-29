<script lang="ts">
  // Path to file: src/lib/game/Game.svelte
  import { onMount, getContext } from "svelte";
  import { GAME_KEY, type GameState } from "./context";
  import { uiState, gameStore } from "./gameStore.svelte";
  import { setupKeyboard, setupTouch } from "./input";
  import GameLoop from "./GameLoop.svelte";

  let { onRestart }: { onRestart?: () => void } = $props();

  const gameState = getContext<GameState>(GAME_KEY);

  // Подписываемся на обновления
  onMount(() => {
    // gameStore.onUpdate(() => {
    //   updateUI();
    // });

    if (!gameState) return;
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
  });

  // Инициализируем UI
  // updateUI();

  function handleRestart() {
    gameStore.reset();

    if (gameState) {
      gameState.bricks.forEach((b) => (b.status = 1));
      gameState.ball.x = gameState.canvas.width / 2;
      gameState.ball.y = gameState.canvas.height - 35;
      gameState.ball.dx = 2;
      gameState.ball.dy = -2;
      gameState.paddle.x =
        (gameState.canvas.width - gameState.paddle.size.width) / 2;
      // ⚠️ сброс input — чтобы «зажатая» клавиша не тянула платформу
      gameState.input.leftPressed = false;
      gameState.input.rightPressed = false;
    }

    onRestart?.(); // ← триггерит {#key} в родителе
  }
</script>

<!-- остальной код без изменений -->
<div class="game-container">
  {#if gameState}
    {#if !uiState.gameOver}
      <div class="game-controls">
        <button onclick={() => gameStore.togglePause()} class="pause-btn">
          {uiState.paused ? "▶ Resume" : "⏸ Pause"}
        </button>
        <div class="game-stats">
          <span class="score">Score: {uiState.score}</span>
          <span class="lives">Lives: {uiState.lives}</span>
        </div>
      </div>

      <GameLoop {gameState} />
    {:else}
      <div class="game-over">
        <h2>{uiState.win ? "🎉 You Win!" : "💀 Game Over!"}</h2>
        <p class="score">Final Score: {uiState.score}</p>
        <button onclick={handleRestart} class="restart-btn">
          Play Again
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .game-container {
    position: relative;
    display: inline-block;
    max-width: 100%;
    margin: 0 auto;
  }

  .game-controls {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 8px 12px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    pointer-events: none;
    max-width: 480px; /* совпадает с canvas */
    margin: 0 auto;
  }

  .pause-btn {
    pointer-events: auto;
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
    padding-inline: 30px;
    display: flex;
    gap: 20px;
    color: #333;
    font-weight: bold;
    pointer-events: none;
    font-size: clamp(12px, 3vw, 16px);
  }

  .score {
    color: #4caf50;
  }
  .lives {
    color: #f44336;
  }
</style>
