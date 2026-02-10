import { setContext } from "svelte";

export type CanvasSize = {
  width: number;
  height: number;
};

export type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
};

export type PaddleSize = {
  width: number;
  height: number;
};

export type Paddle = {
  x: number;
  size: PaddleSize;
};

export type Brick = {
  x: number;
  y: number;
  width: number;
  height: number;
  status: number;
  color?: string;
};

export type Input = {
  rightPressed: boolean;
  leftPressed: boolean;
};

export type GameState = {
  ctx: CanvasRenderingContext2D;
  canvas: CanvasSize;
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[];
  input: Input;
};

export const GAME_KEY = Symbol('game');

// Функция для инициализации кирпичей
export function initBricks(): Brick[] {
  const brickRowCount = 3;
  const brickColumnCount = 5;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;
  const bricks: Brick[] = [];

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      const hue = (r * 60) % 360;

      bricks.push({
        x: brickX,
        y: brickY,
        width: brickWidth,
        height: brickHeight,
        status: 1,
        color: `hsl(${hue}, 100%, 50%)`
      });
    }
  }

  return bricks;
}

// Экспортируем setContext напрямую
export { setContext };
