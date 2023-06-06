let seed = Math.floor(Math.random() * 1000000000000000);
const originalSeed = seed;
console.log('seed', originalSeed);

const sizeQueryParam = parseInt(new URLSearchParams(window.location.search).get('size') ?? 0, 10); // TODO remove for release

// PALETTE
const PALETTES = [
  {
    name: 'Breaking News',
    background: [35, 25, 88],
    colors: [[340, 8, 15], [5, 9, 28], [17, 7, 38], [35, 28, 80], [0, 0, 98]],
    accentColor: [10, 90, 52],
    size: 'MEDIUM',
  },
  {
    name: 'Spectrum',
    background: [35, 25, 88],
    colors: [[354, 85, 63], [337, 100, 63], [183, 100, 32], [41, 100, 53], [18, 100, 59], [222, 53, 42]],
    size: 'LARGE',
  },
  {
    name: 'Bubblegum Sun',
    background: [35, 25, 88],
    colors: [[222, 53, 42], [41, 100, 53], [324, 91, 75]],
    size: 'MEDIUM',
  },
  {
    name: 'Neon Bar',
    background: [35, 25, 88],
    colors: [[0, 0, 0], [202, 100, 37], [193, 72, 63], [326, 100, 64]],
    size: 'MEDIUM',
  },
  {
    name: 'Blush',
    background: [35, 25, 88],
    colors: [[353, 49, 54], [352, 100, 65], [358, 100, 78], [357, 59, 88]],
    size: 'MEDIUM',
  },
  {
    name: 'Retro',
    background: [35, 25, 88],
    colors: [[353, 49, 54], [352, 100, 65], [183, 100, 27], [169, 44, 57]],
    size: 'MEDIUM',
  },
  {
    name: 'Summer Haze',
    background: [35, 25, 88],
    colors: [[41, 100, 53], [352, 100, 65], [358, 100, 78], [264, 49, 65]],
    size: 'MEDIUM',
  }, 
  {
    name: 'Cyano',
    background: [35, 25, 88],
    colors: [[193, 72, 63], [202, 100, 37], [222, 53, 42], [358, 100, 78]],
    size: 'MEDIUM',
  },
  {
    name: 'Tigerbalm',
    background: [35, 25, 88],
    colors: [[18, 100, 59], [76, 19, 37], [153, 100, 33], [102, 44, 49]],
    size: 'MEDIUM',
  },
  {
    name: 'Kingfisher',
    background: [35, 25, 88],
    colors: [[20, 54, 48], [183, 100, 27], [183, 100, 32], [357, 59, 88]],
    size: 'MEDIUM',
  },
  {
    name: 'Ficus',
    background: [35, 25, 88],
    colors: [[76, 19, 37], [36, 27, 55], [24, 64, 45], [210, 1, 54]],
    size: 'MEDIUM',
  },
  {
    name: 'Blackprint',
    background: [[35, 25, 88]],
    colors: [[0, 0, 0]],
    size: 'SMALL',
  },
];

const BORDER_WIDTH_RATIO = 0.085; // ratio of the canvas width, note that 0.085 gives a 1.5 DRAWING_HEIGHT_RATIO
const BORDER_EXCLUDE = false; // whether to prohibit rendering dots in the border area
const BORDER_OVERLAY = true; // whether we redraw the border over whatever is in the border area at the end of each frame

const DOT_DENSITY = 800; // number of dots (on the x axis)
const DOT_SIZE = 1 / Math.sqrt(2); // the distance from the center of the dot to a corner - do not change
const DOT_SIZE_NOISE_DENSITY = 0.025; // the density of the Perlin noise that distorts the corners of the dots
const DOT_SIZE_NOISE_MAGNITUDE = 0.25; // the magnitude of the Perlin noise that distorts the corners of the dots
const DOT_SIZE_GAUSSIAN_SD = 0.15; // the standard deviation of the Gaussian noise that distorts the corners of the dots
const DOT_H_SD = 2; // the standard deviation of the Gaussian noise that affects the Hue of the dots
const DOT_S_SD = 2; // the standard deviation of the Gaussian noise that affects the Saturation of the dots
const DOT_L_SD = 2; // the standard deviation of the Gaussian noise that affects the Lightness of the dots
const DOT_ALPHA_MEAN = 80; // the mean Alpha of the dots
const DOT_ALPHA_SD = 10; // the standard deviation of the Gaussian noise that affects the Alpha of the dots
const DOT_PARTIAL_SIDE_GRANULARITY = 8; // the level of accuracy for calculating partial dots for smooth curve edges - do not change

const TILE_ZOOM_RATIO = chooseFromList([0.5, 1, 2, 4, 0.66, 0.75, 1.33, 1.5]); // the zoom of the Chladni tiles
const TILE_X_OFFSET = chooseFromList([-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]); // the x-offset of the Chladni tiles
const TILE_Y_OFFSET = chooseFromList([-1.25, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25]); // the y-offset of the Chladni tiles

const ROTATION = chooseFromList([-81, -64, -49, -36, -25, -16, -9, 0, 9, 16, 25, 36, 49, 64, 81]);

const LAYER_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE = 0.1; // the maximum offset of the center of rotation of the layer from the center of the canvas (as a ratio of the width of the drawing)
const LAYER_MISREGISTRATION = chooseFromList(['NONE', 'VERY_LOW', 'LOW', 'MEDIUM', 'HIGH']);
const LAYER_ROTATIONAL_OFFSET_MAX = {
  NONE: 0,
  VERY_LOW: 0.25,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3
}[LAYER_MISREGISTRATION]; // the maximum rotation of a layer (in degrees)
const LAYER_TRANSLATIONAL_OFFSET_MAX_DISTANCE = {
  NONE: 0,
  VERY_LOW: 0.0025,
  LOW: 0.01,
  MEDIUM: 0.02,
  HIGH: 0.03
}[LAYER_MISREGISTRATION]; // the maximum offset of the center of the layer from the center of the canvas (as a ratio of the width of the drawing)

const PALETTE = chooseFromList(PALETTES);

const LAYER_COLOR_REPEAT_COUNT = chooseFromList(
  {
    SMALL: [4, 8],
    MEDIUM: [1, 2, 4, 8],
    LARGE: [1, 2]
  }[PALETTE.size]
);

const COORDINATE_SYSTEM = chooseFromList(['CARTESIAN', 'POLAR']);
const POLAR_CENTER_X = chooseFromList([-0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5])
const POLAR_CENTER_Y = chooseFromList([-0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2])

const LAYER_COLOR_GAPS_ALLOWED = false; // chooseByProbability([{ value: true, probability: 0.1 }, { value: false, probability: 0.9 }]).value; // are gaps allowed in the layers (i.e. a layer with no color)
const LAYER_COLOR_SHUFFLE = false; // n.b. if true, this allows two same coloured layers next to each other, which (if offset) is a strange concept for risograph
const LAYER_COLOR_RANGE_MIN = 0.1; // the minimum Chladni range for a layer - a smaller value gives narrower layers
const LAYER_DISTRIBUTION = chooseFromList(['RANDOM', 'ONE_THICK', 'ONE_THIN']);

let shapes;

function setup() {
  console.log('setup start')
  CANVAS = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  CANVAS.parent('sketch-canvas');
  randomSeed(randomUnit() * 1000);
  noiseSeed(randomUnit() * 1000)
  colorMode(HSL, 360, 100, 100, 100);
  background(...PALETTE.background); 

  shapes = [];

  let n, m, a, b;
  do {
    n = randomIntInRange(1, 5);
    m = randomIntInRange(1, 5);
    a = randomIntInRange(-10, 10);
    b = randomIntInRange(-10, 10);
  } while (
    // either of these give a blank canvas: see https://www.desmos.com/calculator/rdpbran7og
    (a === 0 && b === 0) ||
    (a === -b && Math.abs(n) === Math.abs(m))
  )

  const colorsCount = PALETTE.colors.length * LAYER_COLOR_REPEAT_COUNT;
  const maxForColorRange = Math.abs(m) !== Math.abs(n)
    ? Math.abs(a) + Math.abs(b)
    : Math.abs(a + b)

  const gapAtMin = LAYER_COLOR_GAPS_ALLOWED ? random() < 0.5 : false;
  const gapAtMax = LAYER_COLOR_GAPS_ALLOWED ? random() < 0.5 : false;
  const gapCount = LAYER_COLOR_GAPS_ALLOWED ? chooseFromList((new Array(colorsCount - 1)).fill(0).map((_, i) => i + 1)) : 0;
  const gaps = shuffle((new Array(colorsCount - 1)).fill(0).map((_, i) => i)).slice(0, gapCount);
  const paletteColors = [];
  for (let i = 0; i < LAYER_COLOR_REPEAT_COUNT; i++) {
    paletteColors.push(...PALETTE.colors);
  }
  if (LAYER_COLOR_SHUFFLE) shuffle(paletteColors);
  if (PALETTE.accentColor != null) paletteColors.splice(Math.floor(randomUnit() * (paletteColors.length + 1)), 0, PALETTE.accentColor);

  const ranges = [];
  const totalSlotCount = (2 * maxForColorRange) / LAYER_COLOR_RANGE_MIN;

  let slotCount = 0;
  if (gapAtMin) ranges.push({ slotCount: 1 });
  for (let i = 0; i < colorsCount; i++) {
    ranges.push({ color: paletteColors[i % paletteColors.length], slotCount: 1 });
    if (++slotCount >= totalSlotCount) break;
    if (gaps.includes(i)) ranges.push({ slotCount: 1 });
    if (++slotCount >= totalSlotCount) break;
  }
  if (gapAtMax && ranges.length < totalSlotCount) ranges.push({ slotCount: 1 });

  let totalRemainingSlots = totalSlotCount - ranges.length;
  let specialIndex;
  while (specialIndex == null || ranges[specialIndex].color == null) specialIndex = 1 + Math.floor(random() * (ranges.length - 2)); // n.b. can ranges ever be <= 2?
  while (totalRemainingSlots > 0) {
    const index = Math.floor(random() * ranges.length);
    if (
      !LAYER_DISTRIBUTION ||
      (LAYER_DISTRIBUTION === 'ONE_THICK' && index !== specialIndex && randomUnit() < 1 - (1 / ranges.length)) ||
      (LAYER_DISTRIBUTION === 'ONE_THIN' && index === specialIndex && randomUnit() < 1 - (1 / ranges.length))
    ) continue;
    ranges[index].slotCount += 1;
    totalRemainingSlots--;
  }

  let cumulativeSlotCount = -maxForColorRange / LAYER_COLOR_RANGE_MIN;
  for (let i = 0; i < ranges.length; i++) {
    const increment = ranges[i].slotCount;
    ranges[i].range = [cumulativeSlotCount, cumulativeSlotCount + increment].map(a => a * Math.round(LAYER_COLOR_RANGE_MIN * 10) / 10);
    delete ranges[i].slotCount;
    cumulativeSlotCount += increment;
  }

  const noiseOffsets = (new Array(ranges.length)).fill(0).map(_ => randomUnit() * 1000)
  const offsets = (new Array(ranges.length)).fill(0).map(_ => ({ x: randomFloat(-LAYER_TRANSLATIONAL_OFFSET_MAX_DISTANCE, LAYER_TRANSLATIONAL_OFFSET_MAX_DISTANCE), y: randomFloat(-LAYER_TRANSLATIONAL_OFFSET_MAX_DISTANCE, LAYER_TRANSLATIONAL_OFFSET_MAX_DISTANCE) }))
  const angleOffsets = (new Array(ranges.length)).fill(0).map(_ => ({ angle: randomFloat(2 * PI * -LAYER_ROTATIONAL_OFFSET_MAX / 360, 2 * PI * LAYER_ROTATIONAL_OFFSET_MAX / 360), x: randomFloat(-LAYER_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE, LAYER_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE) + DRAWING_WIDTH_RATIO / 2, y: randomFloat(-LAYER_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE, LAYER_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE) + DRAWING_HEIGHT_RATIO / 2 }));
  shapes = (new Array(ranges.length)).fill(0).map(_ => []);

  const getChladni = (xOrig, yOrig) => {
    const xAngleCenter = DRAWING_WIDTH_RATIO / 2;
    const yAngleCenter = DRAWING_HEIGHT_RATIO / 2;
    const theta = atan2((xOrig - xAngleCenter), (yOrig - yAngleCenter));
    const distance = Math.sqrt((xOrig - xAngleCenter)**2 + (yOrig - yAngleCenter)**2);

    let x = xAngleCenter + sin(theta - (2 * Math.PI * ROTATION / 360)) * distance;
    let y = yAngleCenter + cos(theta - (2 * Math.PI * ROTATION / 360)) * distance;

    x = (x - TILE_X_OFFSET) / TILE_ZOOM_RATIO;
    y = (y - TILE_Y_OFFSET) / TILE_ZOOM_RATIO;

    if (COORDINATE_SYSTEM === 'POLAR') {
      const xPolarCenter = (POLAR_CENTER_X - TILE_X_OFFSET) / TILE_ZOOM_RATIO;
      const yPolarCenter = (POLAR_CENTER_Y - TILE_Y_OFFSET) / TILE_ZOOM_RATIO;
      const polarTheta = atan2((x - xPolarCenter), (y - yPolarCenter));
      const polarDistance = Math.sqrt((x - xPolarCenter)**2 + (y - yPolarCenter)**2);

      x = polarDistance;
      y = ((polarTheta - Math.PI) / Math.PI);
    }

    return (
      a *
      sin(PI * n * x) *
      sin(PI * m * y) + 
      b *
      sin(PI * m * x) *
      sin(PI * n * y)
    );
  }

  for (let i = 0; i < DOT_DENSITY * DRAWING_WIDTH_RATIO; i++) {
    for (let j = 0; j < DOT_DENSITY * DRAWING_HEIGHT_RATIO; j++) {
      const baseX = (i + 0.5) / DOT_DENSITY; 
      const baseY = (j + 0.5) / DOT_DENSITY;

      const corners = [];
      let rangeIndexesSet = new Set();
      for (let k = 0; k < 4; k++) {
        const angle = Math.PI / 4 + k * 2 * PI / 4;
        const cornerX = baseX + sin(angle) * DOT_SIZE / DOT_DENSITY;
        const cornerY = baseY + cos(angle) * DOT_SIZE / DOT_DENSITY;
        const chladniValue = getChladni(cornerX, cornerY);
        const rangeIndex = ranges.findIndex(({ range }) => range[0] <= chladniValue && range[1] >= chladniValue);
        rangeIndexesSet.add(rangeIndex);
        corners.push({ x: cornerX, y: cornerY, rangeIndex, angle, distance: DOT_SIZE / DOT_DENSITY });
      }

      for (const rangeIndex of Array.from(rangeIndexesSet)) {
        const color = ranges[rangeIndex]?.color;

        if (color == null) continue;

        const mids = [];
        for (let cornerIndex = 0; cornerIndex < 4; cornerIndex++) {
          let mid = undefined;
          const corner = corners[cornerIndex];
          const nextCorner = corners[(cornerIndex + 1) % 4];
          if ((corner.rangeIndex === rangeIndex || nextCorner.rangeIndex === rangeIndex) && corner.rangeIndex !== nextCorner.rangeIndex) {
            const xDiff = nextCorner.x - corner.x;
            const yDiff = nextCorner.y - corner.y;
            for (let q = 1; q < DOT_PARTIAL_SIDE_GRANULARITY; q++) {
              const newX = corner.x + (q / DOT_PARTIAL_SIDE_GRANULARITY) * xDiff;
              const newY = corner.y + (q / DOT_PARTIAL_SIDE_GRANULARITY) * yDiff;
              const newChladniValue = getChladni(newX, newY);
              const newRangeIndex = ranges.findIndex(({ range }) => range[0] <= newChladniValue && range[1] >= newChladniValue);
              if (
                (corner.rangeIndex === rangeIndex && ((newRangeIndex !== rangeIndex) || q === DOT_PARTIAL_SIDE_GRANULARITY - 1)) ||
                (corner.rangeIndex !== rangeIndex && ((newRangeIndex === rangeIndex) || q === DOT_PARTIAL_SIDE_GRANULARITY - 1))
              ) { // q === DOT_PARTIAL_SIDE_GRANULARITY - 1 is a small hack
                const angle = atan2(newX - baseX, newY - baseY);
                const distance = Math.sqrt((newX - baseX)**2 + (newY - baseY)**2);
                mid = { x: newX, y: newY, rangeIndex, angle, distance };
                break;
              }
            }
          }
          mids.push(mid);
        }

        const shape = {
          fill: [
            randomGaussian(color[0], DOT_H_SD),
            randomGaussian(color[1], DOT_S_SD),
            randomGaussian(color[2], DOT_L_SD),
            randomGaussian(DOT_ALPHA_MEAN, DOT_ALPHA_SD),
          ],
          vertexes: []
        }

        const { angle: angleOffset, x: xAngleCenter, y: yAngleCenter } = angleOffsets[rangeIndex];
        const theta = atan2((baseX - xAngleCenter), (baseY - yAngleCenter));
        const distance = Math.sqrt((baseX - xAngleCenter)**2 + (baseY - yAngleCenter)**2);

        const xRotated = xAngleCenter + sin(theta - angleOffset) * distance + (offsets[rangeIndex]?.x ?? 0);
        const yRotated = yAngleCenter + cos(theta - angleOffset) * distance + (offsets[rangeIndex]?.y ?? 0);

        const noiseValue = noise(i * DOT_SIZE_NOISE_DENSITY + noiseOffsets[rangeIndex], j * DOT_SIZE_NOISE_DENSITY + noiseOffsets[rangeIndex]) - 0.5;

        const vertexes = []
        for (let i = 0; i < 4; i++) {
          for (let vertex of [corners[i], mids[i]]) {
            if (!(vertex == null || vertex.rangeIndex !== rangeIndex)) vertexes.push(vertex);
          }
        }

        for (const vertex of vertexes) {
          const dotDistortionX = 1 + noiseValue * DOT_SIZE_NOISE_MAGNITUDE + randomGaussian(0, DOT_SIZE_GAUSSIAN_SD);
          const dotDistortionY = 1 + noiseValue * DOT_SIZE_NOISE_MAGNITUDE + randomGaussian(0, DOT_SIZE_GAUSSIAN_SD);

          const x = xRotated + sin(vertex.angle) * dotDistortionX * vertex.distance;
          const y = yRotated + cos(vertex.angle) * dotDistortionY * vertex.distance;
          if (BORDER_EXCLUDE && (x < 0 || y < 0 || x > DRAWING_WIDTH_RATIO || y > DRAWING_HEIGHT_RATIO)) continue;
          shape.vertexes.push([
            (BORDER_WIDTH_RATIO + DRAWING_TO_CANVAS_RATIO * x) * CANVAS_WIDTH,
            (BORDER_WIDTH_RATIO + DRAWING_TO_CANVAS_RATIO * y) * CANVAS_WIDTH,
          ])
        }

        shapes[rangeIndex].push(shape)
      }
    }
  }
  console.log('setup done')
  // TODO - belts and braces check that if % of one color is too high then we retry the entire setup
}

function draw() {
  noStroke();

  for (const shape of shapes[frameCount - 1]) {
    fill(...shape.fill);
    beginShape();
    for (const [x, y] of shape.vertexes) vertex(x, y);
    endShape()
  }

  fill(...PALETTE.background);
  if (BORDER_OVERLAY) {
    rect(0, 0, CANVAS_WIDTH, BORDER_WIDTH_RATIO * CANVAS_WIDTH);
    rect(0, 0, BORDER_WIDTH_RATIO * CANVAS_WIDTH, CANVAS_HEIGHT);
    rect(CANVAS_WIDTH, CANVAS_HEIGHT, -CANVAS_WIDTH, -BORDER_WIDTH_RATIO * CANVAS_WIDTH);
    rect(CANVAS_WIDTH, CANVAS_HEIGHT, -BORDER_WIDTH_RATIO * CANVAS_WIDTH, -CANVAS_HEIGHT);
  }

  if (frameCount === shapes.length) {
    noLoop();
    if (downloadIndexParam != null) {
      save(`resoriso-${originalSeed}-${downloadIndexParam}-${COORDINATE_SYSTEM}-${PALETTE.name}-${LAYER_COLOR_REPEAT_COUNT}-${LAYER_MISREGISTRATION}-${TILE_ZOOM_RATIO}-${LAYER_COLOR_GAPS_ALLOWED}-${LAYER_DISTRIBUTION}.png`);
      if (downloadIndexParam > 1) {
        let url =
          `${window.location.protocol}//${window.location.host + window.location.pathname}?downloadIndex=${downloadIndexParam - 1}`;
        if (sizeQueryParam > 0) url += `&size=${sizeQueryParam}`;
        setTimeout(() => window.location.href = url, 3000);
      }
    }
  }
}

/// utils:

// dimensions
const CANVAS_WIDTH_RATIO = 1;
const CANVAS_HEIGHT_RATIO = Math.sqrt(2);

const DRAWING_WIDTH_RATIO = 1;
const DRAWING_HEIGHT_RATIO = (CANVAS_HEIGHT_RATIO - 2 * BORDER_WIDTH_RATIO) / (CANVAS_WIDTH_RATIO - 2 * BORDER_WIDTH_RATIO);

const CANVAS_HEIGHT = Math.round(!!sizeQueryParam // TODO remove for release
  ? (sizeQueryParam * CANVAS_HEIGHT_RATIO)
  : window.innerHeight
);
const CANVAS_WIDTH = Math.round(CANVAS_HEIGHT * CANVAS_WIDTH_RATIO / CANVAS_HEIGHT_RATIO);

const DRAWING_TO_CANVAS_RATIO = 1 - (2 * BORDER_WIDTH_RATIO);

// random numbers
function randomUnit() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function randomFloat(min, max) {
  return min + (randomUnit() * ((max - min)));
}

function chooseFromList(list) {
  return list[Math.floor(randomUnit() * list.length)];
}

function randomIntInRange(min, max) {
  return min + Math.floor(randomUnit() * (1 + (max - min)));
}

function chooseByProbability(list) {
  let cumulativeProbability = 0;
  const listWithCumulatives = list
    .map((listElement) => {
      cumulativeProbability += (listElement.probability ?? 1);
      return {
        ...listElement,
        cumulativeProbability,
      }
    }).map(l => ({ ...l, cumulativeProbability: l.cumulativeProbability/cumulativeProbability }))
  listWithCumulatives[listWithCumulatives.length - 1].cumulativeProbability = 1; // to avoid rounding errors

  const rand = randomUnit();
  return listWithCumulatives.find(o => rand < o.cumulativeProbability);
}

const downloadIndexParam = new URLSearchParams(window.location.search).get('downloadIndex') != null // TODO remove for release
  ? parseInt(new URLSearchParams(window.location.search).get('downloadIndex') ?? 0, 10)
  : undefined;

console.log('bottom')
