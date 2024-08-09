function MergeSort(arr, left=0, right=arr.length - 1,swapsRegister = [[...arr]]){
    if(left < right){
        let center = Math.floor((left + right)/2);
        MergeSort(arr, left, center, swapsRegister);
        MergeSort(arr, center+1, right, swapsRegister);
        merge(arr, left, center, right, swapsRegister);    
    }
    return swapsRegister;
}

function merge(arr, left, center, right, swapsRegister) {
    let i = left;
    let j = center + 1;
    let k = 0;
    let b = new Array(right - left + 1);
    
    while (i <= center && j <= right) {
        if (arr[i] <= arr[j]) {
            b[k++] = arr[i++];
        } else {
            b[k++] = arr[j++];
        }
        swapsRegister.push(Array.from(arr)); 
    }

    while (i <= center) {
        b[k++] = arr[i++];
        swapsRegister.push(Array.from(arr));
    }

    while (j <= right) {
        b[k++] = arr[j++];
        swapsRegister.push(Array.from(arr)); 
    }

    for (k = 0; k < b.length; k++) {
        arr[left + k] = b[k];
        swapsRegister.push(Array.from(arr)); 
    }
}

export default MergeSort;