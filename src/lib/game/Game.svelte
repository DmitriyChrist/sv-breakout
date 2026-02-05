<script lang="ts">
  import { onMount } from "svelte";
  import { getGameState } from "./context";
  import { setupKeyboard, setupTouch } from "./input";
  import GameLoop from "./GameLoop.svelte";

  const { ctx, paddle, input, canvas } = getGameState();

  let isGameOver = false;

  function handleGameOver() {
    isGameOver = true; // ✅ Это изменение ВНУТРИ реактивного контекста
  }

  onMount(() => {
    const cleanupKeyboard = setupKeyboard(input);
    const cleanupTouch = setupTouch(ctx.canvas, paddle, canvas.width);

    return () => {
      cleanupKeyboard();
      cleanupTouch();
    };
  });
</script>

{#if !isGameOver}
  <GameLoop on:gameover={handleGameOver} />
{:else}
  <div class="game-over">Game Over!</div>
{/if}
