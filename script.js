import { bubbleSort } from './sorts/bubbleSort.js';
import { selectionSort } from './sorts/selectionSort.js';
import { mergeSort } from './sorts/mergeSort.js';
import { quickSort } from './sorts/quickSort.js';
import { heapSort } from './sorts/heapSort.js';
import { updateChart } from './utils/chart.js';
import { visualizeArray, shuffleArray } from './utils/visualizer.js';

const arrayContainer = document.getElementById('array-container');
const algorithmSelect = document.getElementById('algorithm-select');
const sizeSlider = document.getElementById('size-slider');
const startBtn = document.getElementById('start-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const runtimeDisplay = document.getElementById('runtime');
const stepsDisplay = document.getElementById('steps');

let array = [];
let steps = 0;

function generateArray(size) {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 300) + 10);
  visualizeArray(array);
}
generateArray(sizeSlider.value);

sizeSlider.addEventListener('input', () => {
  generateArray(sizeSlider.value);
});

shuffleBtn.addEventListener('click', () => {
  shuffleArray(array);
  visualizeArray(array);
});

startBtn.addEventListener('click', async () => {
  let sortFunc;
  steps = 0;
  runtimeDisplay.textContent = '0 ms';
  stepsDisplay.textContent = '0';

  switch (algorithmSelect.value) {
    case 'bubble': sortFunc = bubbleSort; break;
    case 'selection': sortFunc = selectionSort; break;
    case 'merge': sortFunc = mergeSort; break;
    case 'quick': sortFunc = quickSort; break;
    case 'heap': sortFunc = heapSort; break;
  }

  const t0 = performance.now();
  await sortFunc(array, visualizeArray, () => steps++);
  const t1 = performance.now();

  runtimeDisplay.textContent = `${(t1 - t0).toFixed(2)} ms`;
  stepsDisplay.textContent = steps;
  updateChart(algorithmSelect.value);
});
