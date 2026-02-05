import type { Input, Paddle } from "./context";

export function setupKeyboard(input: Input): () => void {
  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "Right" || e.key === "ArrowRight") input.rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft")
      input.leftPressed = true;
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (e.key === "Right" || e.key === "ArrowRight") input.rightPressed = false;
    else if (e.key === "Left" || e.key === "ArrowLeft")
      input.leftPressed = false;
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
    e.preventDefault();
    if (!isTouching) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    paddle.x = Math.max(
      0,
      Math.min(touchX - paddle.size.width / 2, canvasWidth - paddle.size.width),
    );
  };

  const touchStart = (e: TouchEvent) => {
    e.preventDefault();
    isTouching = true;
  };

  const touchEnd = (e: TouchEvent) => {
    e.preventDefault();
    isTouching = false;
  };

  canvas.addEventListener("touchstart", touchStart);
  canvas.addEventListener("touchmove", touchMove);
  canvas.addEventListener("touchend", touchEnd);

  return () => {
    canvas.removeEventListener("touchstart", touchStart);
    canvas.removeEventListener("touchmove", touchMove);
    canvas.removeEventListener("touchend", touchEnd);
  };
}
