function QuickSort(arr,start=0,end=null, swapsRegister=[[...arr]]){
    if(end === null){
        end = arr.length - 1;
    }

    if(start < end){
        let pivot_index = partition(arr,start,end, swapsRegister);
        QuickSort(arr,start,pivot_index,swapsRegister);
        QuickSort(arr,pivot_index + 1,end,swapsRegister);
    }

    return swapsRegister;
}

function partition(arr,start,end,swapsRegister){
    let pivot = arr[start];
    let low = start + 1;
    let high = end;
    while(true){
        while(low <= high && arr[high] >= pivot){
            high -= 1;
        }
        while(low <= high && arr[low] <= pivot){
            low += 1;
        }
        if(low <= high){
            [arr[low], arr[high]] = [arr[high], arr[low]];
            swapsRegister.push(Array.from(arr));
        }else{
            break;
        }
    }
    [arr[start], arr[high]] = [arr[high], arr[start]];
    swapsRegister.push(Array.from(arr));
    
    return high;
}

export default QuickSort;