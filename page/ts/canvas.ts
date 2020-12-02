export class Canvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(selector: string) {
    this.canvas = document.querySelector(selector);
    this.context = this.canvas.getContext('2d');
    this.setPixelRatio();
  }

  draw(drawer: (context: CanvasRenderingContext2D) => void) {
    this.context.save();
    drawer(this.context);
    this.context.restore();
  }

  setPixelRatio() {
    this.context.restore();
    this.context.save();
    this.context.scale(devicePixelRatio, devicePixelRatio);
  }

  setSize(width: number, height: number, pixelRatio: number = 1) {
    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.setPixelRatio();
  }
}