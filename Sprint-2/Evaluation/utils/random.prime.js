function isPrime(num) {
  if (num < 2) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}
///math.random will give the 0.0 to 1.0 random values
function getRandomPrime(max) {
  let primes = [];
  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  if (primes.length === 0) return null;
  let randomPrime = Math.floor(Math.random() * primes.length);
  return primes[randomPrime];
}
module.exports = getRandomPrime;
