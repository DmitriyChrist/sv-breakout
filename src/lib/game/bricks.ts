// Path to file: src/lib/game/bricks.ts
import type { Brick, Ball } from "./context";
import { drawRect } from "$lib/canvas/shapes";

// Рендер кирпича
export function renderBrick(ctx: CanvasRenderingContext2D, brick: Brick): void {
  if (brick.status === 1) {
    drawRect(
      ctx,
      brick.x,
      brick.y,
      brick.width,
      brick.height,
      brick.color || "#0095DD"
    );
  }
}

// Рендер всех кирпичей
export function renderBricks(ctx: CanvasRenderingContext2D, bricks: Brick[]): void {
  bricks.forEach(brick => renderBrick(ctx, brick));
}

// Проверка столкновения мяча с кирпичом
export function checkBrickCollision(ball: Ball, brick: Brick): boolean {
  if (brick.status === 0) return false;

  const ballNextX = ball.x + ball.dx;
  const ballNextY = ball.y + ball.dy;

  // Проверяем столкновение с учетом следующей позиции мяча
  if (
    ballNextX + ball.radius > brick.x &&
    ballNextX - ball.radius < brick.x + brick.width &&
    ballNextY + ball.radius > brick.y &&
    ballNextY - ball.radius < brick.y + brick.height
  ) {
    return true;
  }

  return false;
}

// Обработка всех столкновений с кирпичами
export function handleBrickCollisions(
  ball: Ball,
  bricks: Brick[]
): { hit: boolean; score: number } {
  let hit = false;
  let score = 0;

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];

    if (checkBrickCollision(ball, brick)) {
      // Разрушаем кирпич
      brick.status = 0;
      hit = true;
      score += 10;

      // Определяем сторону столкновения
      // Узнаем, с какой стороны мяч приближался к кирпичу
      const fromLeft = ball.dx > 0;
      const fromRight = ball.dx < 0;
      const fromTop = ball.dy > 0;
      const fromBottom = ball.dy < 0;

      // Определяем положение мяча относительно кирпича
      const overlapLeft = (ball.x + ball.radius) - brick.x;
      const overlapRight = (brick.x + brick.width) - (ball.x - ball.radius);
      const overlapTop = (ball.y + ball.radius) - brick.y;
      const overlapBottom = (brick.y + brick.height) - (ball.y - ball.radius);

      // Находим минимальное перекрытие
      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      // В зависимости от стороны столкновения меняем направление
      if (minOverlap === overlapLeft || minOverlap === overlapRight) {
        // Горизонтальное столкновение
        ball.dx = -ball.dx;
        // Корректируем позицию, чтобы избежать застревания
        ball.x += ball.dx > 0 ? 1 : -1;
      } else {
        // Вертикальное столкновение
        ball.dy = -ball.dy;
        // Корректируем позицию
        ball.y += ball.dy > 0 ? 1 : -1;
      }

      break; // Обрабатываем только одно столкновение за кадр
    }
  }

  return { hit, score };
}
