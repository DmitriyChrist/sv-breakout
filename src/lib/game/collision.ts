import { type Ball, type Paddle, type Brick, type CanvasSize } from "./context";
// Проверка коллизии мяча с платформой (Step 4)
export function checkPaddleCollision(
  ball: Ball,
  paddle: Paddle,
  canvasHeight: number,
): void {
  const paddleY = canvasHeight - paddle.size.height;

  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.size.width &&
    ball.y + ball.dy > paddleY - ball.radius &&
    ball.y < paddleY
  ) {
    ball.dy = -ball.dy;
  }
}

// Проверка коллизии с кирпичами (Step 6)
export function checkBrickCollision(ball: Ball, brick: Brick): boolean {
  if (brick.status === 0) return false; // Кирпич уже разрушен

  if (
    ball.x > brick.x &&
    ball.x < brick.x + brick.width &&
    ball.y > brick.y &&
    ball.y < brick.y + brick.height
  ) {
    ball.dy = -ball.dy;
    brick.status = 0; // Разрушаем кирпич
    return true; // Коллизия произошла
  }

  return false;
}

// Проверка коллизии мяча со стенами
// Коллизия со стенами (БЕЗ нижней стены теперь!)
export function checkWallCollision(ball: Ball, canvas: CanvasSize): void {
  // Лево/право
  if (
    ball.x + ball.dx > canvas.width - ball.radius ||
    ball.x + ball.dx < ball.radius
  ) {
    ball.dx = -ball.dx;
  }

  // Только верх!
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  }
}

// Проверка Game Over
// Game Over - мяч ниже платформы
export function checkGameOver(ball: Ball, canvas: CanvasSize): boolean {
  return ball.y + ball.dy > canvas.height - ball.radius;
}
