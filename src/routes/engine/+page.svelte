<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Game from "$lib/engine/game/Game.svelte";
  let canvasElement: HTMLCanvasElement;
</script>

<canvas bind:this={canvasElement} width={480} height={320} class="game-canvas"
></canvas>

{#if canvasElement}
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
