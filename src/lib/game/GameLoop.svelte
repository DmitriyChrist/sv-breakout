<script lang="ts">
  // Path to file: src/lib/game/GameLoop.svelte
  import { onMount } from "svelte";
  import {
    updateBall,
    updatePaddle,
    renderBall,
    renderPaddle,
  } from "./entities";
  import { checkWallCollision, checkPaddleCollision } from "./collision";
  import { renderBricks, handleBrickCollisions } from "./bricks";
  import { drawText } from "$lib/canvas/shapes";
  import type { GameState } from "./context";
  import { gameStore, uiState } from "./gameStore.svelte";

  export let gameState: GameState;

  onMount(() => {
    let animationId: number;
    const { ctx, canvas, ball, paddle, input, bricks } = gameState;

    function gameLoop() {
      if (uiState.gameOver) {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!uiState.paused) {
        updatePaddle(paddle, input, canvas.width);
        updateBall(ball);

        checkWallCollision(ball, canvas);
        checkPaddleCollision(ball, paddle, canvas.height);

        const { hit, score: brickScore } = handleBrickCollisions(ball, bricks);
        if (hit) {
          gameStore.incrementScore(brickScore);

          if (gameStore.checkWin(bricks)) {
            cancelAnimationFrame(animationId);
            return;
          }
        }

        if (ball.y + ball.radius > canvas.height) {
          gameStore.decrementLives();

          if (uiState.gameOver) {
            cancelAnimationFrame(animationId);
            return;
          } else {
            ball.x = canvas.width / 2;
            ball.y = canvas.height - 35;
            ball.dx = 2;
            ball.dy = -2;
            paddle.x = (canvas.width - paddle.size.width) / 2;
          }
        }
      }

      renderBricks(ctx, bricks);
      renderPaddle(ctx, paddle, canvas.height);
      renderBall(ctx, ball);

      // drawText(ctx, `Score: ${uiState.score}`, 8, 20, "16px Arial", "#000");
      // drawText(
      //   ctx,
      //   `Lives: ${uiState.lives}`,
      //   canvas.width - 65,
      //   20,
      //   "16px Arial",
      //   "#000",
      // );

      if (uiState.paused) {
        drawText(
          ctx,
          "PAUSED",
          canvas.width / 2 - 40,
          canvas.height / 2,
          "24px Arial",
          "#FF5722",
        );
        drawText(
          ctx,
          "Press SPACE to resume",
          canvas.width / 2 - 80,
          canvas.height / 2 + 30,
          "14px Arial",
          "#333",
        );
      }

      animationId = requestAnimationFrame(gameLoop);
    }

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });
</script>
