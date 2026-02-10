<script lang="ts">
  import { onMount } from "svelte";
  import {
    setContext,
    initBricks,
    GAME_KEY,
    type GameState,
  } from "$lib/game/context";
  import Game from "$lib/game/Game.svelte";

  let canvasElement: HTMLCanvasElement;
  let isGameReady = false;

  onMount(() => {
    const ctx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
    const bricks = initBricks();

    const gameState: GameState = {
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
      bricks,
      input: { rightPressed: false, leftPressed: false },
    };

    setContext(GAME_KEY, gameState);
    isGameReady = true;
  });
</script>

<canvas bind:this={canvasElement} width={480} height={320} class="game-canvas"
></canvas>

{#if isGameReady}
  <Game />
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
