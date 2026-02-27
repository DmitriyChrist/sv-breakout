// Тип шарика (можно экспортировать для использования в других местах)
export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
}

/**
 * Создаёт новый шарик с заданными параметрами.
 * Если координаты не указаны, размещает по центру.
 */
// export function createBall(
//   width: number,
//   height: number,
//   baseSpeed: number = 8,
//
//   x?: number,
//   y?: number
// ): Ball {
//   const angle = Math.random() * 2 * Math.PI;
//   return {
//     x: x ?? width / 2,
//     y: y ?? height / 2,
//     dx: Math.cos(angle) * speed,
//     dy: Math.sin(angle) * speed,
//     size: 20,
//   };
// }

export function createBall(
  width: number,
  height: number,
  baseSpeed: number = 8,
  speedVariation: number = 6, // диапазон случайного отклонения
  x?: number,
  y?: number
): Ball {
  const angle = Math.random() * 2 * Math.PI;
  // случайная скорость от baseSpeed - speedVariation до baseSpeed + speedVariation
  const actualSpeed = baseSpeed + (Math.random() * 2 - 1) * speedVariation;
  return {
    x: x ?? width / 2,
    y: y ?? height / 2,
    dx: Math.cos(angle) * actualSpeed,
    dy: Math.sin(angle) * actualSpeed,
    size: 20,
  };
}

/**
 * Обновляет позицию шарика и обрабатывает столкновения с границами.
 * Возвращает новый объект шарика с изменёнными координатами и скоростями.
 */
// export function updateBall(ball: Ball, width: number, height: number): Ball {
//   let { x, y, dx, dy, size } = ball;
//   const half = size / 2;
//
//   // Движение
//   x += dx;
//   y += dy;
//
//   // Левая/правая граница
//   if (x + half > width) {
//     x = width - half;
//     dx = -dx;
//   } else if (x < half) {
//     x = half;
//     dx = -dx;
//   }
//
//   // Верхняя/нижняя граница
//   if (y + half > height) {
//     y = height - half;
//     dy = -dy;
//   } else if (y < half) {
//     y = half;
//     dy = -dy;
//   }
//
//   return { x, y, dx, dy, size };
// }
//
// /**
//  * Обновляет массив шариков, применяя updateBall к каждому.
//  * Возвращает новый массив.
//  */
// export function updateBalls(balls: Ball[], width: number, height: number): Ball[] {
//   return balls.map(ball => updateBall(ball, width, height));
// }
