function merge(a, b) {
    let arr = [];
    //Create a new array to store the merged values in

    while (a.length && b.length) {
        if (a[0] <= b[0]) arr.push(a.shift());
        else arr.push(b.shift());
        //Merge the arrays
    }

    return [...arr, ...a, ...b];
    //Return the merged array along with any remaining elements
}

Array.prototype.binarySearch = function(element) {
    let arr = this.mergeSort();
    //Assume the array is unsorted and perform a merge sort on it

    let start = 0;
    let end = arr.length - 1;
    //Set start and end index variables

    while (start <= end) {
        let index = Math.floor((start + end) / 2);
        //Check in the middle of the current section of the array being searched

        if (arr[index] == element) return index;
        else if (arr[index] > element) end = index - 1;
        else start = index + 1;
        //Adjust appropriate variables if the element isn't in the centre, otherwise return the index it was found at
    }

    return -1;
    //Return -1 if element is not in the array
};

Array.prototype.mergeSort = function() {
    if (this.length <= 1) return [...this];
    //If the array is 0 or 1 elements, return a copy of the original array as it is already sorted

    else return merge(this.slice(0, this.length / 2).mergeSort(), this.slice(this.length / 2).mergeSort());
    //Otherwise split the array in 2 and return the result
};