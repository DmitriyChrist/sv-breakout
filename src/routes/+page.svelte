<script lang="ts">
  import { onMount } from "svelte";
  import { setGameState } from "$lib/game/context";
  import Game from "$lib/game/Game.svelte";

  let canvasElement: HTMLCanvasElement;
  let isReady = false;

  onMount(() => {
    const ctx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
    setGameState({
      ctx,
      canvas: {
        width: canvasElement.width,
        height: canvasElement.height,
      },
      ball: {
        x: canvasElement.width / 2,
        y: canvasElement.height - 35,
        dx: 2,
        dy: -2,
        radius: 10,
      },
      paddle: {
        x: (canvasElement.width - 75) / 2,
        size: {
          width: 75,
          height: 10,
        },
      },
      input: { rightPressed: false, leftPressed: false },
      lives: 3,
      score: 0,
    });

    isReady = true;
  });
</script>

<canvas bind:this={canvasElement} width="480" height="320"></canvas>
{#if isReady}<Game />{/if}

<style global>
  canvas {
    background: #eee;
    display: block;
    margin: 0 auto;
    touch-action: none;
  }
</style>
