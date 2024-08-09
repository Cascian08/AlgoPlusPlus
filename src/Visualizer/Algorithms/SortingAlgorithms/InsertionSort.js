function InsertionSort(arr) {
    const n = arr.length;
    const swapsRegister = [[...arr]];

    for (let i = 1; i < n; i++) {
        const currentElement = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > currentElement) {
            arr[j + 1] = arr[j];
            j--;
            swapsRegister.push(Array.from(arr));
        }

        arr[j + 1] = currentElement;
        swapsRegister.push(Array.from(arr));
    }

    return swapsRegister;
}

export default InsertionSort;