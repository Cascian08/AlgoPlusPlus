import BubbleSort from "./SortingAlgorithms/BubbleSort";
import QuickSort from "./SortingAlgorithms/QuickSort";
import MergeSort from "./SortingAlgorithms/MergeSort";
import InsertionSort from "./SortingAlgorithms/InsertionSort";

export default function algoList(name){
    const list = {
        "QuickSort": QuickSort,
        "Bubble Sort": BubbleSort,
        "Merge Sort": MergeSort,
        "Insertion Sort": InsertionSort
    }
    
    return list[name];
}