// script.js

// ------------------------- DOM Elements -------------------------
const arrayContainer = document.getElementById('array-container');
const algorithmSelect = document.getElementById('algorithm-select');
const sizeSlider = document.getElementById('size-slider');
const startBtn = document.getElementById('start-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const runtimeDisplay = document.getElementById('runtime');
const stepsDisplay = document.getElementById('steps');

// ------------------------- Chart.js Setup -------------------------
const ctx = document.getElementById('complexityChart').getContext('2d');
const complexityChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Array Values',
      data: [],
      borderColor: '#61dafb',
      backgroundColor: 'rgba(97, 218, 251, 0.2)',
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      x: { title: { display: true, text: 'Step' } },
      y: { title: { display: true, text: 'Value' }, min: 0, max: 310 }
    }
  }
});

// ------------------------- Variables -------------------------
let array = [];
let steps = 0;

// ------------------------- Utility Functions -------------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function visualizeArray(arr, highlighted = []) {
  arrayContainer.innerHTML = '';
  const size = arr.length;
  arrayContainer.style.setProperty('--size', size);

  arr.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value}px`;
    if (highlighted.includes(index)) bar.classList.add('active');
    arrayContainer.appendChild(bar);
  });
}

function updateChart(arr) {
  complexityChart.data.labels.push(steps);
  complexityChart.data.datasets[0].data = [...arr];
  complexityChart.update('none');
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function generateArray(size) {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 300) + 10);
  visualizeArray(array);
}

// ------------------------- Sorting Algorithms -------------------------
async function bubbleSort(arr, visualize, incrementStep) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        incrementStep();
        visualize(arr, [j, j + 1]);
        updateChart(arr);
        await sleep(10);
      }
    }
  }
}

async function selectionSort(arr, visualize, incrementStep) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      incrementStep();
      visualize(arr, [i, minIdx]);
      updateChart(arr);
      await sleep(10);
    }
  }
}

async function mergeSort(arr, visualize, incrementStep) {
  async function merge(arr, l, m, r) {
    const L = arr.slice(l, m + 1);
    const R = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < L.length && j < R.length) {
      arr[k] = (L[i] <= R[j]) ? L[i++] : R[j++];
      incrementStep();
      visualize(arr, [k]);
      updateChart(arr);
      await sleep(10);
      k++;
    }

    while (i < L.length) {
      arr[k++] = L[i++];
      incrementStep();
      visualize(arr, [k - 1]);
      updateChart(arr);
      await sleep(10);
    }

    while (j < R.length) {
      arr[k++] = R[j++];
      incrementStep();
      visualize(arr, [k - 1]);
      updateChart(arr);
      await sleep(10);
    }
  }

  async function mergeSortRec(arr, l, r) {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      await mergeSortRec(arr, l, m);
      await mergeSortRec(arr, m + 1, r);
      await merge(arr, l, m, r);
    }
  }

  await mergeSortRec(arr, 0, arr.length - 1);
}

async function quickSort(arr, visualize, incrementStep) {
  async function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        incrementStep();
        visualize(arr, [i, j]);
        updateChart(arr);
        await sleep(10);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    incrementStep();
    visualize(arr, [i + 1, high]);
    updateChart(arr);
    await sleep(10);
    return i + 1;
  }

  async function quickSortRec(low, high) {
    if (low < high) {
      const pi = await partition(low, high);
      await quickSortRec(low, pi - 1);
      await quickSortRec(pi + 1, high);
    }
  }

  await quickSortRec(0, arr.length - 1);
}

async function heapSort(arr, visualize, incrementStep) {
  const n = arr.length;

  async function heapify(n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      incrementStep();
      visualize(arr, [i, largest]);
      updateChart(arr);
      await sleep(10);
      await heapify(n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    incrementStep();
    visualize(arr, [0, i]);
    updateChart(arr);
    await sleep(10);
    await heapify(i, 0);
  }
}

// ------------------------- Initialize -------------------------
generateArray(sizeSlider.value);

// ------------------------- Event Listeners -------------------------
sizeSlider.addEventListener('input', () => generateArray(sizeSlider.value));

shuffleBtn.addEventListener('click', () => {
  shuffleArray(array);
  visualizeArray(array);
  complexityChart.data.labels = [];
  complexityChart.data.datasets[0].data = [];
  complexityChart.update();
});

startBtn.addEventListener('click', async () => {
  let sortFunc;
  steps = 0;
  runtimeDisplay.textContent = '0 ms';
  stepsDisplay.textContent = '0';

  complexityChart.data.labels = [];
  complexityChart.data.datasets[0].data = [];
  complexityChart.update();

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
});
