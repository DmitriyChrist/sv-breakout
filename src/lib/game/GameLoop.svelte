<script lang="ts">
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
  import { gameStore } from "./gameStore";

  export let gameState: GameState;

  onMount(() => {
    let animationId: number;
    const { ctx, canvas, ball, paddle, input, bricks } = gameState;

    function gameLoop() {
      const state = gameStore.getState();

      if (state.gameOver) {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!state.paused) {
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

          const newState = gameStore.getState();
          if (newState.gameOver) {
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

      const currentState = gameStore.getState();

      renderBricks(ctx, bricks);
      renderPaddle(ctx, paddle, canvas.height);
      renderBall(ctx, ball);

      drawText(
        ctx,
        `Score: ${currentState.score}`,
        8,
        20,
        "16px Arial",
        "#000",
      );
      drawText(
        ctx,
        `Lives: ${currentState.lives}`,
        canvas.width - 65,
        20,
        "16px Arial",
        "#000",
      );

      if (currentState.paused) {
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
