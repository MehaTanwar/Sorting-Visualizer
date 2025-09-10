let array = [];
let speed = 100;

// Generate initial array
function generateArray(size = 30) {
  const slider = document.getElementById("sizeSlider");
  size = size || slider.value;
  document.getElementById("sizeValue").innerText = size;

  array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 300) + 10);
  }
  renderArray();
}

function renderArray(highlight = []) {
  const container = document.getElementById("array");
  container.innerHTML = "";
  array.forEach((value, idx) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    if (highlight.includes(idx)) {
      bar.style.background = "red";
    }
    container.appendChild(bar);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById("speedSlider").addEventListener("input", e => {
  speed = e.target.value;
  document.getElementById("speedValue").innerText = `${speed}ms`;
});

// 🔹 Main Run Function
async function runSort() {
  const algorithm = document.getElementById("algorithm").value;
  const start = performance.now();

  switch (algorithm) {
    case "bubble": await bubbleSort(); break;
    case "selection": await selectionSort(); break;
    case "insertion": await insertionSort(); break;
    case "merge": await mergeSortWrapper(); break;
    case "quick": await quickSortWrapper(); break;
    case "heap": await heapSort(); break;
    case "counting": countingSort(); break;
    case "radix": radixSort(); break;
  }

  const end = performance.now();
  document.getElementById("runtime").innerText = `${(end - start).toFixed(2)} ms`;
}

// 🔹 Bubble Sort
async function bubbleSort() {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      renderArray([j, j+1]);
      await sleep(speed);
      if (array[j] > array[j+1]) {
        [array[j], array[j+1]] = [array[j+1], array[j]];
      }
    }
  }
  renderArray();
}

// 🔹 Selection Sort
async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let j = i+1; j < array.length; j++) {
      renderArray([min, j]);
      await sleep(speed);
      if (array[j] < array[min]) min = j;
    }
    [array[i], array[min]] = [array[min], array[i]];
  }
  renderArray();
}

// 🔹 Insertion Sort
async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      renderArray([j, j+1]);
      await sleep(speed);
      array[j+1] = array[j];
      j--;
    }
    array[j+1] = key;
  }
  renderArray();
}

// 🔹 Merge Sort
async function mergeSortWrapper() {
  await mergeSort(0, array.length - 1);
  renderArray();
}

async function mergeSort(left, right) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSort(left, mid);
  await mergeSort(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  const temp = [];
  let i = left, j = mid + 1;
  while (i <= mid && j <= right) {
    renderArray([i, j]);
    await sleep(speed);
    if (array[i] < array[j]) temp.push(array[i++]);
    else temp.push(array[j++]);
  }
  while (i <= mid) temp.push(array[i++]);
  while (j <= right) temp.push(array[j++]);
  for (let k = left; k <= right; k++) array[k] = temp[k - left];
}

// 🔹 Quick Sort
async function quickSortWrapper() {
  await quickSort(0, array.length - 1);
  renderArray();
}

async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high], i = low - 1;
  for (let j = low; j < high; j++) {
    renderArray([j, high]);
    await sleep(speed);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  [array[i+1], array[high]] = [array[high], array[i+1]];
  return i+1;
}

// 🔹 Heap Sort
async function heapSort() {
  let n = array.length;
  for (let i = Math.floor(n/2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }
  for (let i = n-1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    await heapify(i, 0);
  }
  renderArray();
}

async function heapify(n, i) {
  let largest = i;
  let l = 2*i + 1, r = 2*i + 2;
  if (l < n && array[l] > array[largest]) largest = l;
  if (r < n && array[r] > array[largest]) largest = r;
  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    renderArray([i, largest]);
    await sleep(speed);
    await heapify(n, largest);
  }
}

// 🔹 Counting Sort (non-comparison based)
function countingSort() {
  let max = Math.max(...array);
  let count = new Array(max+1).fill(0);
  array.forEach(num => count[num]++);
  let idx = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i]-- > 0) array[idx++] = i;
  }
  renderArray();
}

// 🔹 Radix Sort
function radixSort() {
  let max = Math.max(...array);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    countingSortForRadix(exp);
    exp *= 10;
  }
  renderArray();
}

function countingSortForRadix(exp) {
  let output = new Array(array.length).fill(0);
  let count = new Array(10).fill(0);
  for (let i = 0; i < array.length; i++) {
    count[Math.floor(array[i]/exp) % 10]++;
  }
  for (let i = 1; i < 10; i++) {
    count[i] += count[i-1];
  }
  for (let i = array.length - 1; i >= 0; i--) {
    let digit = Math.floor(array[i]/exp) % 10;
    output[count[digit]-1] = array[i];
    count[digit]--;
  }
  for (let i = 0; i < array.length; i++) array[i] = output[i];
}

generateArray();
