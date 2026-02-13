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
  /* стили без изменений */
</style>
