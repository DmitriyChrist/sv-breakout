import { drawCircle, drawRect } from "$lib/canvas/shapes";
import { checkWallCollision, checkPaddleCollision } from "./collision";
import { type Ball, type Paddle, type Input, type CanvasSize } from "./context";

const PADDLE_SPEED = 7;
// Update
export function updateBall(
  ball: Ball,
  paddle: Paddle,
  canvas: CanvasSize,
): void {
  checkWallCollision(ball, canvas);
  checkPaddleCollision(ball, paddle, canvas.height);
  ball.x += ball.dx;
  ball.y += ball.dy;
}

export function updatePaddle(
  paddle: Paddle,
  input: Input,
  canvasWidth: number,
): void {
  if (input.rightPressed) {
    paddle.x = Math.min(
      paddle.x + PADDLE_SPEED,
      canvasWidth - paddle.size.width,
    );
  } else if (input.leftPressed) {
    paddle.x = Math.max(paddle.x - PADDLE_SPEED, 0);
  }
}

// Render
export function renderBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
  drawCircle(ctx, ball.x, ball.y, ball.radius, "#0095DD");
}

export function renderPaddle(
  ctx: CanvasRenderingContext2D,
  paddle: Paddle,
  canvasHeight: number,
): void {
  const paddleY = canvasHeight - paddle.size.height;
  drawRect(
    ctx,
    paddle.x,
    paddleY,
    paddle.size.width,
    paddle.size.height,
    "#0095DD",
  );
}
