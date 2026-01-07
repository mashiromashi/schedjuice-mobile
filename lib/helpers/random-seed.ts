export function seededRandom(seed: number) {
  return function () {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}
