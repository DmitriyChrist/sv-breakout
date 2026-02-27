
import { type Ball } from "$lib/new_path/ball";

// src/lib/game/brick.ts
export interface Brick {
  x: number;
  y: number;
}

export const BRICK_WIDTH = 60;
export const BRICK_HEIGHT = 15;

export function createBrick(x: number, y: number): Brick {
  return { x, y };
}

export function createBrickGrid(
  cols: number,
  rows: number,
  startX: number,
  startY: number,
  gapX: number = 10,
  gapY: number = 10
): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (BRICK_WIDTH + gapX) + BRICK_WIDTH / 2;
      const y = startY + r * (BRICK_HEIGHT + gapY) + BRICK_HEIGHT / 2;
      bricks.push(createBrick(x, y));
    }
  }
  return bricks;
}

/**
 * Проверяет столкновение мяча с кирпичами.
 * Возвращает объект с новым мячом и индексом первого задетого кирпича (или null, если столкновений нет).
 */
export function handleBrickCollisions(
  ball: Ball,
  bricks: Brick[],
  brickWidth: number,
  brickHeight: number
): { newBall: Ball; hitIndex: number | null } {
  const half = ball.size / 2;
  const ballL = ball.x - half;
  const ballR = ball.x + half;
  const ballT = ball.y - half;
  const ballB = ball.y + half;

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    const brickL = brick.x - brickWidth / 2;
    const brickR = brick.x + brickWidth / 2;
    const brickT = brick.y - brickHeight / 2;
    const brickB = brick.y + brickHeight / 2;

    // Проверка пересечения
    if (ballL > brickR || ballR < brickL) continue;
    if (ballT > brickB || ballB < brickT) continue;

    // Определяем сторону столкновения по минимальному перекрытию
    const overlapX = Math.min(ballR - brickL, brickR - ballL);
    const overlapY = Math.min(ballB - brickT, brickB - ballT);

    // Создаём копию мяча
    let newBall = { ...ball };

    if (overlapX < overlapY) {
      // Столкновение по горизонтали
      newBall.x = ball.x - ball.dx; // откат позиции
      newBall.dx = -ball.dx;
    } else if (overlapX > overlapY) {
      // Столкновение по вертикали
      newBall.y = ball.y - ball.dy;
      newBall.dy = -ball.dy;
    } else {
      // Угловое столкновение (равные перекрытия)
      newBall.x = ball.x - ball.dx;
      newBall.y = ball.y - ball.dy;
      newBall.dx = -ball.dx;
      newBall.dy = -ball.dy;
    }

    // Возвращаем новый мяч и индекс разрушенного кирпича
    return { newBall, hitIndex: i };
  }

  return { newBall: ball, hitIndex: null };
}
