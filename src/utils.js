export function randomInt(min, max) { // from min (inclusive) to max (inclusive)
  return min + Math.floor(fxrand() * ((max - min) + 1));
}

export function randomFloat(min, max) { // from min (inclusive) to max (exclusive)
  return min + (fxrand() * ((max - min)));
}

export function chooseByProbability(list) {
  let cumulativeProbability = 0;
  const rand = fxrand();
  return list
    .map((listElement) => {
      cumulativeProbability += (listElement.probability ?? 1);
      return {
        ...listElement,
        cumulativeProbability,
      }
    })
    .find(o => rand < o.cumulativeProbability)
}

export function convertLocalToCanvasCoordinates(x, y, config) {
  return [
    config.derived.drawing.topLeftX + x * config.derived.drawing.width,
    config.derived.drawing.topLeftY + y * config.derived.drawing.height,
  ];
}
