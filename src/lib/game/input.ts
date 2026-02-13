import type { Input, Paddle } from "./types";
import { Engine } from "./Engine.ts"
export function setupKeyboard(input: Input): () => void {
  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      input.rightPressed = true;
    } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      input.leftPressed = true;
    }
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      input.rightPressed = false;
    } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      input.leftPressed = false;
    }
  };

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  return () => {
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
  };
}

export function setupTouch(
  canvas: HTMLCanvasElement,
  paddle: Paddle,
  canvasWidth: number,
): () => void {
  let isTouching = false;

  const touchMove = (e: TouchEvent) => {
    if (!isTouching || e.touches.length === 0) return;

    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;

    const touchX = (touch.clientX - rect.left) * scaleX;

    paddle.x = Math.max(
      0,
      Math.min(touchX - paddle.size.width / 2, canvasWidth - paddle.size.width),
    );
  };

  const touchStart = (e: TouchEvent) => {
    if (e.touches.length === 0) return;

    e.preventDefault();
    isTouching = true;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;

    const touchX = (touch.clientX - rect.left) * scaleX;
    paddle.x = Math.max(
      0,
      Math.min(touchX - paddle.size.width / 2, canvasWidth - paddle.size.width),
    );
  };

  const touchEnd = () => {
    isTouching = false;
  };

  const touchCancel = () => {
    isTouching = false;
  };

  canvas.addEventListener("touchstart", touchStart, { passive: false });
  canvas.addEventListener("touchmove", touchMove, { passive: false });
  canvas.addEventListener("touchend", touchEnd);
  canvas.addEventListener("touchcancel", touchCancel);

  return () => {
    canvas.removeEventListener("touchstart", touchStart);
    canvas.removeEventListener("touchmove", touchMove);
    canvas.removeEventListener("touchend", touchEnd);
    canvas.removeEventListener("touchcancel", touchCancel);
  };
}
