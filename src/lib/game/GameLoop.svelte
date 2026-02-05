<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { getGameState } from "./context";
  import {
    updateBall,
    updatePaddle,
    renderBall,
    renderPaddle,
  } from "./entities";
  import { checkGameOver } from "./collision";

  const { ctx, canvas, ball, paddle, input } = getGameState();
  const dispatch = createEventDispatcher();

  onMount(() => {
    let animationId: number;

    function gameLoop() {
      if (checkGameOver(ball, canvas)) {
        dispatch("gameover", { reason: "ball-lost" });
        return;
      }
      // 1. Очистка
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. Обновление логики
      updatePaddle(paddle, input, canvas.width);
      updateBall(ball, paddle, canvas);

      // 3. Рендер (порядок = z-index)
      renderPaddle(ctx, paddle, canvas.height);
      renderBall(ctx, ball);

      animationId = requestAnimationFrame(gameLoop);
    }

    animationId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationId);
  });
</script>

<!-- Компоненты Ball и Paddle больше не нужны -->
