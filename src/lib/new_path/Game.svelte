<script lang="ts">
  import { onMount } from "svelte";
  import { createBall, type Ball } from "$lib/new_path/ball";
  import {
    createBrickGrid,
    handleBrickCollisions,
    BRICK_WIDTH,
    BRICK_HEIGHT,
    type Brick,
  } from "$lib/new_path/brick";

  let { container }: { container: HTMLElement } = $props();

  let width = $state(0);
  let height = $state(0);
  let balls: Ball[] = $state([]);
  let bricks: Brick[] = $state([]);
  let score = $state(0);
  let animationId: number | null = null;

  function addBalls(count: number) {
    const newBalls = Array.from({ length: count }, () =>
      createBall(width, height, 8),
    );
    balls = [...balls, ...newBalls];
  }

  // Обработка границ (вынесена отдельно для чистоты)
  function handleBoundaryCollision(ball: Ball, w: number, h: number): Ball {
    let { x, y, dx, dy, size } = ball;
    const half = size / 2;

    if (x + half > w) {
      x = w - half;
      dx = -dx;
    } else if (x < half) {
      x = half;
      dx = -dx;
    }

    if (y + half > h) {
      y = h - half;
      dy = -dy;
    } else if (y < half) {
      y = half;
      dy = -dy;
    }

    return { x, y, dx, dy, size };
  }

  function tick() {
    const bricksToRemove = new Set<number>();
    const newBalls = balls.map((b) => {
      // 1. Двигаем мяч (применяем скорость)
      let movedBall = { ...b, x: b.x + b.dx, y: b.y + b.dy };

      // 2. Проверяем столкновение с границами (корректируем позицию и скорость)
      movedBall = handleBoundaryCollision(movedBall, width, height);

      // 3. Проверяем столкновение с кирпичами (возвращает скорректированный мяч и индекс разрушенного кирпича)
      const { newBall, hitIndex } = handleBrickCollisions(
        movedBall,
        bricks,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      );

      if (hitIndex !== null) {
        bricksToRemove.add(hitIndex);
        score += 10;
      }

      return newBall;
    });

    // 4. Удаляем разрушенные кирпичи
    if (bricksToRemove.size > 0) {
      bricks = bricks.filter((_, idx) => !bricksToRemove.has(idx));
    }

    // 5. Обновляем состояние мячей
    balls = newBalls;
  }

  function gameLoop() {
    tick();
    animationId = requestAnimationFrame(gameLoop);
  }

  onMount(() => {
    width = container.clientWidth;
    height = container.clientHeight;

    // Создаём кирпичи (5 колонок, 3 ряда, начальные координаты)
    bricks = createBrickGrid(5, 3, 50, 50, 10, 10);
    addBalls(8); // для начала один мяч

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  });
</script>

<div style="position: relative; width: 100%; height: 100%;">
  <!-- Тени для мячей -->
  <div
    style="position: absolute; left: 0; top: 0; width: 0; height: 0; box-shadow: {balls
      .map((b) => `${b.x}px ${b.y}px 0 ${b.size / 2}px #fff`)
      .join(',')};"
  ></div>

  <!-- Тени для кирпичей (со смещением, чтобы центр тени совпадал с центром кирпича) -->
  <div
    style="position: absolute; left: -{BRICK_WIDTH}px; top: -{BRICK_HEIGHT}px; width: {BRICK_WIDTH}px; height: {BRICK_HEIGHT}px; box-shadow: {bricks
      .map(
        (b) =>
          `${b.x + BRICK_WIDTH / 2}px ${b.y + BRICK_HEIGHT / 2}px 0 0 #fff`,
      )
      .join(',')};"
  ></div>

  <!-- Отображение счёта -->
  <div
    style="position: absolute; top: 10px; left: 10px; color: white; font-family: monospace;"
  >
    Score: {score}
  </div>
</div>
