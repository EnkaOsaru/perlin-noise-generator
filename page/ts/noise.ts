export class PerlinNoise {
  randoms: number[] = new Array(PerlinNoise.RANDOM_BUFFER_SIZE);

  constructor() {
    for (let i = 0; i < PerlinNoise.RANDOM_BUFFER_SIZE; i++) {
      this.randoms[i] = Math.random();
    }
  }

  at(x: number, y: number): number {
    const gridX = Math.trunc(x);
    const gridY = Math.trunc(y);
    const gradients = [
      this.getGradient(gridX, gridY),
      this.getGradient(gridX + 1, gridY),
      this.getGradient(gridX, gridY + 1),
      this.getGradient(gridX + 1, gridY + 1)
    ];

    const decimalX = x - Math.trunc(x);
    const decimalY = y - Math.trunc(y);
    const distances: [number, number][] = [
      [decimalX, decimalY],
      [decimalX - 1, decimalY],
      [decimalX, decimalY - 1],
      [decimalX - 1, decimalY - 1]
    ];

    const dots = new Array<number>(4);
    for (let i = 0; i < 4; i++) {
      const [x1, y1] = gradients[i];
      const [x2, y2] = distances[i];
      dots[i] = x1 * x2 + y1 * y2;
    }

    const fade1 = PerlinNoise.fade(decimalX, dots[0], dots[1]);
    const fade2 = PerlinNoise.fade(decimalX, dots[2], dots[3]);
    const result = PerlinNoise.fade(decimalY, fade1, fade2);

    return result * Math.SQRT2 / 2 + 0.5;
  }

  getGradient(x: number, y: number): [number, number] {
    const index = (13 * x + 17 * y) % PerlinNoise.RANDOM_BUFFER_SIZE;
    const angle = 2 * Math.PI * this.randoms[index];
    return [Math.cos(angle), Math.sin(angle)];
  }

  static readonly RANDOM_BUFFER_SIZE = 256;

  static fade(x: number, from: number, to: number): number {
    const p = 6 * (x ** 5) - 15 * (x ** 4) + 10 * (x ** 3);
    return (to - from) * p + from;
  }
}

export class PerlinNoiseStack {
  depth: number;
  corrector: number;
  perlinNoises: PerlinNoise[];

  constructor(depth: number) {
    const r = PerlinNoiseStack.DECAY_FACTOR;
    this.depth = depth;
    this.corrector = ((1 / r) ** this.depth - 1) / (1 / r - 1);

    this.perlinNoises = new Array(this.depth);
    for (let i = 0; i < this.depth; i++) {
      this.perlinNoises[i] = new PerlinNoise();
    }
  }

  at(x: number, y: number): number {
    let sum = 0;
    for (let i = 0; i < this.depth; i++) {
      const ratio = PerlinNoiseStack.DECAY_FACTOR ** i;
      const value = this.perlinNoises[i].at(ratio * x, ratio * y);
      sum += value / ratio;
    }
    return sum / this.corrector;
  }

  static readonly DECAY_FACTOR = 2;
}