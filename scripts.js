document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const generateArrayBtn = document.getElementById('generateArray');
  const arraySizeInput = document.getElementById('arraySize');
  const barContainer = document.getElementById('barContainer');
  const bestCase = document.getElementById('bestCase');
  const averageCase = document.getElementById('averageCase');
  const worstCase = document.getElementById('worstCase');
  const spaceComplexity = document.getElementById('spaceComplexity');
  const speedInput = document.getElementById('speed');
  const algorithmControls = document.getElementById('algorithmControls');

  // Sorting Algorithms
  const sortingAlgorithms = {
      bubbleSort: {
          time: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
          space: 'O(1)',
          func: bubbleSort
      },
      selectionSort: {
          time: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)' },
          space: 'O(1)',
          func: selectionSort
      },
      insertionSort: {
          time: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
          space: 'O(1)',
          func: insertionSort
      },
      mergeSort: {
          time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
          space: 'O(n)',
          func: mergeSort
      },
      quickSort: {
          time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)' },
          space: 'O(log n)',
          func: quickSort
      },
      heapSort: {
          time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
          space: 'O(1)',
          func: heapSort
      }
  };

  // Global Variables
  let array = [];
  let animationSpeed = 50;

  // Event Listeners
  generateArrayBtn.addEventListener('click', generateArray);
  algorithmControls.addEventListener('click', handleAlgorithmClick);
  speedInput.addEventListener('input', handleSpeedChange);

  // Generate Array Function
  function generateArray() {
      const size = parseInt(arraySizeInput.value, 10);
      array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
      renderArray();
  }

  // Render Array Bars Function
  function renderArray() {
      barContainer.innerHTML = '';
      array.forEach(value => {
          const bar = document.createElement('div');
          bar.className = 'bar';
          bar.style.height = `${value * 4}px`;
          bar.setAttribute('data-value', value);
          barContainer.appendChild(bar);
      });
  }

  // Sorting Algorithm Handler
  async function handleAlgorithmClick(event) {
      if (event.target.tagName === 'BUTTON') {
          const algorithm = event.target.id;
          await sort(algorithm);
      }
  }

  // Sorting Function
  async function sort(algorithm) {
      updateComplexities(algorithm);
      disableControls();
      await sortingAlgorithms[algorithm].func();
      enableControls();
  }

  // Update Complexity Display Function
  function updateComplexities(algorithm) {
      bestCase.textContent = `Best Case: ${sortingAlgorithms[algorithm].time.best}`;
      averageCase.textContent = `Average Case: ${sortingAlgorithms[algorithm].time.average}`;
      worstCase.textContent = `Worst Case: ${sortingAlgorithms[algorithm].time.worst}`;
      spaceComplexity.textContent = `Space Complexity: ${sortingAlgorithms[algorithm].space}`;
  }

  // Disable UI Controls Function
  function disableControls() {
      document.querySelectorAll('#algorithmControls button').forEach(button => {
          button.disabled = true;
          button.classList.add('disabled');
      });
      arraySizeInput.disabled = true;
      speedInput.disabled = true;
  }

  // Enable UI Controls Function
  function enableControls() {
      document.querySelectorAll('#algorithmControls button').forEach(button => {
          button.disabled = false;
          button.classList.remove('disabled');
      });
      arraySizeInput.disabled = false;
      speedInput.disabled = false;
  }

  // Handle Speed Change Function
  function handleSpeedChange() {
      animationSpeed = 101 - speedInput.value; // Speed ranges from 1 (fastest) to 100 (slowest)
  }

  // Sorting Algorithms Implementation

  async function bubbleSort() {
      const n = array.length;
      for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
              if (array[j] > array[j + 1]) {
                  await swap(j, j + 1);
              }
          }
      }
  }

  async function selectionSort() {
      const n = array.length;
      for (let i = 0; i < n - 1; i++) {
          let minIndex = i;
          for (let j = i + 1; j < n; j++) {
              if (array[j] < array[minIndex]) {
                  minIndex = j;
              }
          }
          if (minIndex !== i) {
              await swap(i, minIndex);
          }
      }
  }

  async function insertionSort() {
      const n = array.length;
      for (let i = 1; i < n; i++) {
          let key = array[i];
          let j = i - 1;
          while (j >= 0 && array[j] > key) {
              array[j + 1] = array[j];
              j = j - 1;
              renderArray();
              await new Promise(resolve => setTimeout(resolve, animationSpeed));
          }
          array[j + 1] = key;
      }
  }

  async function mergeSort() {
      await mergeSortHelper(0, array.length - 1);
  }

  async function mergeSortHelper(start, end) {
      if (start >= end) return;
      const mid = Math.floor((start + end) / 2);
      await mergeSortHelper(start, mid);
      await mergeSortHelper(mid + 1, end);
      await merge(start, mid, end);
  }

  async function merge(start, mid, end) {
      const leftSize = mid - start + 1;
      const rightSize = end - mid;
      const leftArray = new Array(leftSize);
      const rightArray = new Array(rightSize);

      for (let i = 0; i < leftSize; i++) {
          leftArray[i] = array[start + i];
      }
      for (let j = 0; j < rightSize; j++) {
          rightArray[j] = array[mid + 1 + j];
      }

      let i = 0, j = 0, k = start;
      while (i < leftSize && j < rightSize) {
          if (leftArray[i] <= rightArray[j]) {
              array[k++] = leftArray[i++];
          } else {
              array[k++] = rightArray[j++];
          }
          renderArray();
          await new Promise(resolve => setTimeout(resolve, animationSpeed));
      }

      while (i < leftSize) {
          array[k++] = leftArray[i++];
          renderArray();
          await new Promise(resolve => setTimeout(resolve, animationSpeed));
      }

      while (j < rightSize) {
          array[k++] = rightArray[j++];
          renderArray();
          await new Promise(resolve => setTimeout(resolve, animationSpeed));
      }
  }

  async function quickSort() {
      await quickSortHelper(0, array.length - 1);
  }

  async function quickSortHelper(start, end) {
      if (start >= end) return;
      const pivotIndex = await partition(start, end);
      await quickSortHelper(start, pivotIndex - 1);
      await quickSortHelper(pivotIndex + 1, end);
  }

  async function partition(start, end) {
      const pivotValue = array[end];
      let pivotIndex = start;
      for (let i = start; i < end; i++) {
          if (array[i] < pivotValue) {
              await swap(i, pivotIndex);
              pivotIndex++;
          }
      }
      await swap(pivotIndex, end);
      return pivotIndex;
  }

  async function heapSort() {
      const n = array.length;
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
          await heapify(n, i);
      }
      for (let i = n - 1; i > 0; i--) {
          await swap(0, i);
          await heapify(i, 0);
      }
  }

  async function heapify(heapSize, rootIndex) {
      let largest = rootIndex;
      const leftChildIndex = 2 * rootIndex + 1;
      const rightChildIndex = 2 * rootIndex + 2;

      if (leftChildIndex < heapSize && array[leftChildIndex] > array[largest]) {
          largest = leftChildIndex;
      }

      if (rightChildIndex < heapSize && array[rightChildIndex] > array[largest]) {
          largest = rightChildIndex;
      }

      if (largest !== rootIndex) {
          await swap(rootIndex, largest);
          await heapify(heapSize, largest);
        }
    }

    async function swap(i, j) {
        [array[i], array[j]] = [array[j], array[i]];
        renderArray();
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }

    // Initial Array Generation and Rendering
    generateArray();

    // Helper Functions

    // Helper function to disable UI during sorting
    function disableControls() {
        document.querySelectorAll('#algorithmControls button').forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
        arraySizeInput.disabled = true;
        speedInput.disabled = true;
    }

    // Helper function to enable UI after sorting
    function enableControls() {
        document.querySelectorAll('#algorithmControls button').forEach(button => {
            button.disabled = false;
            button.classList.remove('disabled');
        });
        arraySizeInput.disabled = false;
        speedInput.disabled = false;
    }

    // Event handler for handling clicks on algorithm buttons
    async function handleAlgorithmClick(event) {
        if (event.target.tagName === 'BUTTON') {
            const algorithm = event.target.id;
            await sort(algorithm);
        }
    }

    // Function to update complexity display based on selected algorithm
    function updateComplexities(algorithm) {
        bestCase.textContent = `Best Case: ${sortingAlgorithms[algorithm].time.best}`;
        averageCase.textContent = `Average Case: ${sortingAlgorithms[algorithm].time.average}`;
        worstCase.textContent = `Worst Case: ${sortingAlgorithms[algorithm].time.worst}`;
        spaceComplexity.textContent = `Space Complexity: ${sortingAlgorithms[algorithm].space}`;
    }

    // Function to handle speed change input
    function handleSpeedChange() {
        animationSpeed = 101 - speedInput.value; // Speed ranges from 1 (fastest) to 100 (slowest)
    }

    // Sorting Algorithms Implementation

    // Bubble Sort
    async function bubbleSort() {
        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    await swap(j, j + 1);
                }
            }
        }
    }

    // Selection Sort
    async function selectionSort() {
        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                await swap(i, minIndex);
            }
        }
    }

    // Insertion Sort
    async function insertionSort() {
        const n = array.length;
        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j = j - 1;
                renderArray();
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
            }
            array[j + 1] = key;
        }
    }

    // Merge Sort
    async function mergeSort() {
        await mergeSortHelper(0, array.length - 1);
    }

    async function mergeSortHelper(start, end) {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        await mergeSortHelper(start, mid);
        await mergeSortHelper(mid + 1, end);
        await merge(start, mid, end);
    }

    async function merge(start, mid, end) {
        const leftSize = mid - start + 1;
        const rightSize = end - mid;
        const leftArray = new Array(leftSize);
        const rightArray = new Array(rightSize);

        for (let i = 0; i < leftSize; i++) {
            leftArray[i] = array[start + i];
        }
        for (let j = 0; j < rightSize; j++) {
            rightArray[j] = array[mid + 1 + j];
        }

        let i = 0, j = 0, k = start;
        while (i < leftSize && j < rightSize) {
            if (leftArray[i] <= rightArray[j]) {
                array[k++] = leftArray[i++];
            } else {
                array[k++] = rightArray[j++];
            }
            renderArray();
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }

        while (i < leftSize) {
            array[k++] = leftArray[i++];
            renderArray();
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }

        while (j < rightSize) {
            array[k++] = rightArray[j++];
            renderArray();
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }
    }

    // Quick Sort
    async function quickSort() {
        await quickSortHelper(0, array.length - 1);
    }

    async function quickSortHelper(start, end) {
        if (start >= end) return;
        const pivotIndex = await partition(start, end);
        await quickSortHelper(start, pivotIndex - 1);
        await quickSortHelper(pivotIndex + 1, end);
    }

    async function partition(start, end) {
        const pivotValue = array[end];
        let pivotIndex = start;
        for (let i = start; i < end; i++) {
            if (array[i] < pivotValue) {
                await swap(i, pivotIndex);
                pivotIndex++;
            }
        }
        await swap(pivotIndex, end);
        return pivotIndex;
    }

    // Heap Sort
    async function heapSort() {
        const n = array.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await heapify(n, i);
        }
        for (let i = n - 1; i > 0; i--) {
            await swap(0, i);
            await heapify(i, 0);
        }
    }

    async function heapify(heapSize, rootIndex) {
        let largest = rootIndex;
        const leftChildIndex = 2 * rootIndex + 1;
        const rightChildIndex = 2 * rootIndex + 2;

        if (leftChildIndex < heapSize && array[leftChildIndex] > array[largest]) {
            largest = leftChildIndex;
        }

        if (rightChildIndex < heapSize && array[rightChildIndex] > array[largest]) {
            largest = rightChildIndex;
        }

        if (largest !== rootIndex) {
            await swap(rootIndex, largest);
            await heapify(heapSize, largest);
        }
    }

    // Function to perform a swap of array elements and update visualization
    async function swap(i, j) {
        [array[i], array[j]] = [array[j], array[i]];
        renderArray();
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }

    // Initial generation and rendering of the array
    generateArray();
});

