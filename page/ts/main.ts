import { PerlinNoiseStack } from './noise';
import { Canvas } from './canvas';

const canvas = new Canvas('canvas#renderer');

const form = document.querySelector('form');
const viewer = document.querySelector('#viewer');

form.addEventListener('submit', e => {
  e.preventDefault();

  const [resolution, depth, scale] = getFormValues(form) as number[];
  const noise = new PerlinNoiseStack(depth);

  canvas.setSize(resolution, resolution);

  canvas.draw(context => {
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const value = 255 * noise.at(scale * x, scale * y);
        context.fillStyle = `rgb(${value}, ${value}, ${value})`;
        context.fillRect(x, y, 1, 1);
      }
    }
  });

  const image = document.createElement('img');
  image.src = canvas.canvas.toDataURL();
  viewer.innerHTML = '';
  viewer.append(image);
});

function getFormValues(form: HTMLFormElement): (number | string)[] {
  return [...form.querySelectorAll('input')]
    .filter(e => e.type !== 'submit')
    .map(e => e.value);
}