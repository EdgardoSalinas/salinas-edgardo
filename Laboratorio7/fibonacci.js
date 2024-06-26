function generateFibonacci(n) {
    const fibonacci = [0, 1];
  
    for (let i = 2; i < n; i++) {
      fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
    }
  
    return fibonacci.slice(0, n);
  }
  
  export default generateFibonacci;
  