// src/lib/game/Engine.ts
import type { Ball, Paddle, Brick, CanvasSize, Input } from './types'; // вынесем типы отдельно
import { updateBall, updatePaddle } from './entities';
import { checkWallCollision, checkPaddleCollision } from './collision';
import { handleBrickCollisions, renderBricks, allBricksDestroyed } from './bricks';
import { renderPaddle, renderBall } from './entities';
import { drawText } from '$lib/canvas/shapes';

// Типы для событий
export type EngineEvents = {
  score: (score: number) => void;
  lives: (lives: number) => void;
  gameOver: (win: boolean) => void;
  pause: (paused: boolean) => void;
  win: () => void;
};

export class Engine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private isRunning = false;

  // Игровое состояние
  public ball: Ball;
  public paddle: Paddle;
  public bricks: Brick[];
  public input: Input;
  public canvasSize: CanvasSize;
  public lives = 3;
  public score = 0;
  public gameOver = false;
  public win = false;
  public paused = false;

  // События (подписчики)
  private listeners: { [K in keyof EngineEvents]?: EngineEvents[K][] } = {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.ctx = ctx;

    this.canvasSize = { width: canvas.width, height: canvas.height };

    // Инициализация объектов
    this.ball = {
      x: canvas.width / 2,
      y: canvas.height - 35,
      dx: 2,
      dy: -2,
      radius: 10,
    };
    this.paddle = {
      x: (canvas.width - 75) / 2,
      size: { width: 75, height: 10 },
    };
    this.input = { rightPressed: false, leftPressed: false };
    this.bricks = this.initBricks();
  }

  // Инициализация кирпичей (можно вынести в утилиту, но оставим здесь)
  private initBricks(): Brick[] {
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
          color: `hsl(${hue}, 100%, 50%)`,
        });
      }
    }
    return bricks;
  }

  // ========== Публичное API ==========
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.gameLoop();
  }

  public stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
  }

  public togglePause(): void {
    this.paused = !this.paused;
    this.emit('pause', this.paused);
  }

  public reset(): void {
    this.stop();
    this.lives = 3;
    this.score = 0;
    this.gameOver = false;
    this.win = false;
    this.paused = false;
    this.ball = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 35,
      dx: 2,
      dy: -2,
      radius: 10,
    };
    this.paddle.x = (this.canvas.width - this.paddle.size.width) / 2;
    this.bricks = this.initBricks();
    this.emit('score', this.score);
    this.emit('lives', this.lives);
    this.emit('gameOver', false);
    this.emit('pause', false);
    this.start();
  }

  // ========== Подписка на события ==========
  public on<K extends keyof EngineEvents>(event: K, callback: EngineEvents[K]): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(callback);
  }

  public off<K extends keyof EngineEvents>(event: K, callback: EngineEvents[K]): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(cb => cb !== callback) as any;
  }

  private emit<K extends keyof EngineEvents>(event: K, ...args: Parameters<EngineEvents[K]>): void {
    this.listeners[event]?.forEach(cb => (cb as any)(...args));
  }

  // ========== Игровой цикл ==========
  private gameLoop = (): void => {
    if (!this.isRunning) return;

    if (!this.gameOver && !this.paused) {
      this.update();
    }
    this.render();

    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  private update(): void {
    // 1. Управление платформой
    updatePaddle(this.paddle, this.input, this.canvas.width);

    // 2. Движение мяча
    updateBall(this.ball);

    // 3. Коллизии со стенами
    checkWallCollision(this.ball, this.canvasSize);

    // 4. Коллизия с платформой
    checkPaddleCollision(this.ball, this.paddle, this.canvas.height);

    // 5. Коллизия с кирпичами
    const { hit, score: brickScore } = handleBrickCollisions(this.ball, this.bricks);
    if (hit) {
      this.score += brickScore;
      this.emit('score', this.score);

      // Проверка победы
      if (allBricksDestroyed(this.bricks)) {
        this.win = true;
        this.gameOver = true;
        this.emit('gameOver', true);
        this.emit('win');
      }
    }

    // 6. Потеря жизни (мяч упал)
    if (this.ball.y + this.ball.radius > this.canvas.height) {
      this.lives--;
      this.emit('lives', this.lives);

      if (this.lives <= 0) {
        this.gameOver = true;
        this.emit('gameOver', false); // false = не победа
      } else {
        // Ресет мяча и платформы
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 35;
        this.ball.dx = 2;
        this.ball.dy = -2;
        this.paddle.x = (this.canvas.width - this.paddle.size.width) / 2;
      }
    }
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Кирпичи
    renderBricks(this.ctx, this.bricks);
    // Платформа
    renderPaddle(this.ctx, this.paddle, this.canvas.height);
    // Мяч
    renderBall(this.ctx, this.ball);

    // UI счёт/жизни (можно оставить внутри Canvas или вынести в Svelte)
    drawText(this.ctx, `Score: ${this.score}`, 8, 20, '16px Arial', '#000');
    drawText(this.ctx, `Lives: ${this.lives}`, this.canvas.width - 65, 20, '16px Arial', '#000');

    // Пауза
    if (this.paused) {
      drawText(
        this.ctx,
        'PAUSED',
        this.canvas.width / 2 - 40,
        this.canvas.height / 2,
        '24px Arial',
        '#FF5722'
      );
      drawText(
        this.ctx,
        'Press SPACE to resume',
        this.canvas.width / 2 - 80,
        this.canvas.height / 2 + 30,
        '14px Arial',
        '#333'
      );
    }

    // Game Over (если нужно — но лучше показывать через Svelte UI)
    if (this.gameOver) {
      drawText(
        this.ctx,
        this.win ? 'YOU WIN!' : 'GAME OVER',
        this.canvas.width / 2 - 60,
        this.canvas.height / 2,
        '30px Arial',
        this.win ? '#4CAF50' : '#F44336'
      );
    }
  }
}
