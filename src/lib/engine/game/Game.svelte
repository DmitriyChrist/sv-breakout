<script lang="ts">
  import { onMount } from "svelte";
  import { Engine } from "./Engine";
  import { setupKeyboard, setupTouch } from "./input";

  export let canvas: HTMLCanvasElement;

  let engine: Engine;
  let score = 0;
  let lives = 0;
  let gameOver = false;
  let win = false;
  let paused = false;

  onMount(() => {
    // 1. Создаём Engine
    engine = new Engine(canvas);

    // 2. Подписка на события Engine
    engine.on("score", (s) => (score = s));
    engine.on("lives", (l) => (lives = l));
    engine.on("gameOver", (w) => {
      gameOver = true;
      win = w;
    });
    engine.on("pause", (p) => (paused = p));

    // 3. Настройка управления платформой (из input.ts)
    const cleanupKeyboard = setupKeyboard(engine.input);
    const cleanupTouch = setupTouch(canvas, engine.paddle, canvas.width);

    // 4. Обработчик клавиатуры для паузы (Space)
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        engine.togglePause();
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    // 5. Запуск игры
    engine.start();

    // 6. Очистка при размонтировании
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cleanupKeyboard();
      cleanupTouch();
      engine.stop();
    };
  });

  function handleRestart() {
    engine.reset();
    gameOver = false;
    win = false;
  }

  function togglePause() {
    engine.togglePause();
  }
</script>

<!-- Шаблон остаётся без изменений -->
<div class="game-container">
  <div class="game-controls">
    <button on:click={togglePause} class="pause-btn">
      {paused ? "▶ Resume" : "⏸ Pause"}
    </button>
    <div class="game-stats">
      <span class="score">Score: {score}</span>
      <span class="lives">Lives: {lives}</span>
    </div>
  </div>

  {#if gameOver}
    <div class="game-over">
      <h2>{win ? " You Win!" : "💀 Game Over!"}</h2>
      <p class="score">Final Score: {score}</p>
      <button on:click={handleRestart} class="restart-btn"> Play Again </button>
    </div>
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
