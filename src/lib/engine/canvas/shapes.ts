export type CanvasCtx = CanvasRenderingContext2D;

export function drawRect(
  ctx: CanvasCtx,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
): void {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.strokeRect(x, y, width, height);
  ctx.closePath();
}

export function drawCircle(
  ctx: CanvasCtx,
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

export function drawStrokedRect(
  ctx: CanvasCtx,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
): void {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string
): void {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}
