<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import Game from "$lib/game/Game.svelte";

  let canvasElement: HTMLCanvasElement;
  let isCanvasReady = false;

  onMount(() => {
    isCanvasReady = true;
  });
</script>

<canvas bind:this={canvasElement} width={480} height={320} class="game-canvas"
></canvas>

{#if isCanvasReady}
  <Game canvas={canvasElement} />
{/if}

<style global>
  .game-canvas {
    background: #eee;
    display: block;
    margin: 0 auto;
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
</style>
