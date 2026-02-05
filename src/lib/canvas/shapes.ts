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
