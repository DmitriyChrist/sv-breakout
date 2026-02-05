import { setContext, getContext } from "svelte";

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
  status: number; // 0 = разрушен, 1 = цел
};

export type Input = {
  rightPressed: boolean;
  leftPressed: boolean;
};

type GameState = {
  ctx: CanvasRenderingContext2D;
  canvas: CanvasSize;
  ball: Ball;
  paddle: Paddle;
  input: Input;
  lives: number;
  score: number;
};

const GAME_KEY = Symbol("game");

export function setGameState(state: GameState): void {
  setContext(GAME_KEY, state);
}

export function getGameState(): GameState {
  return getContext(GAME_KEY) as GameState;
}
