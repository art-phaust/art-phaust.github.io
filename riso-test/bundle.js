// TODO remove for release
const sizeQueryParam = parseInt(new URLSearchParams(window.location.search).get('size') ?? 0, 10);
const dotDensity = parseInt(new URLSearchParams(window.location.search).get('tiledensity') ?? 0, 10);
const seedParam = parseInt(new URLSearchParams(window.location.search).get('seed') ?? 0, 10);
const exportLayers = new URLSearchParams(window.location.search).get('exportlayers');

let seed = seedParam || Math.floor(Math.random() * 1000000000000000);
const originalSeed = seed;
console.log('seed', originalSeed);

if (!seedParam) {
  const url = new URL(location);
  url.searchParams.set('seed', seed);
  history.pushState({}, '', url);
}

const PALETTES = [
  {
    name: 'Breaking News',
    background: [32, 25, 88],
    colors: [[0, 0, 0, 85], [0, 0, 0 , 65], [0, 0, 0 , 50], [241, 1, 54, 40]],
    accentColor: [18, 100, 59, 100],
  },
  {
    name: 'Spectrum',
    background: [32, 25, 88],
    colors: [[354, 85, 63], [337, 100, 63], [183, 100, 32], [41, 100, 53], [18, 100, 59], [222, 53, 42]],
  },
  {
    name: 'Bubblegum Sun',
    background: [32, 25, 88],
    colors: [[222, 53, 42], [41, 100, 53], [324, 91, 75]],
  },
  {
    name: 'Neon Nights',
    background: [32, 25, 88],
    colors: [[0, 0, 0], [202, 100, 37], [193, 72, 63], [326, 100, 64]],
  },
  {
    name: 'Coral',
    background: [32, 25, 88],
    colors: [[193, 72, 63], [202, 100, 37], [222, 53, 42], [358, 100, 78]],
  },
  {
    name: 'Kingfisher',
    background: [32, 25, 88],
    colors: [[20, 54, 48], [183, 100, 27], [183, 100, 32], [357, 59, 88]],
  },
  {
    name: 'Ficus',
    background: [32, 25, 88],
    colors: [[76, 19, 37], [36, 27, 55], [24, 64, 45], [210, 1, 54]],
  },
  {
    name: 'Metal',
    background: [[32, 25, 88]],
    colors: [[20, 54, 48], [353, 49, 54], [36, 27, 55], [221, 38, 39]],
  },
  {
    name: 'Roller Disco',
    background: [[32, 25, 88]],
    colors: [[178, 52, 68], [41, 100, 53], [326, 100, 64], [264, 49, 65]],
  },
  {
    name: 'Duo A',
    background: [[32, 25, 88]],
    colors: [[261, 30, 51], [200, 72, 63]],
  },
  {
    name: 'Duo B',
    background: [[32, 25, 88]],
    colors: [[326, 100, 64], [183, 100, 27]],
  },
  {
    name: 'Duo C',
    background: [[32, 25, 88]],
    colors: [[324, 91, 75], [202, 100, 37]],
    colors: [[324, 91, 75], [202, 100, 37]],
  },
  {
    name: 'Mono Black',
    background: [[32, 25, 88]],
    colors: [[0, 0, 0]],
  },
  {
    name: 'Mono Blue',
    background: [[32, 25, 88]],
    colors: [[222, 53, 42]],
  },
  {
    name: 'Mono Sun',
    background: [[32, 25, 88]],
    colors: [[41, 100, 53]],
  },
  {
    name: 'Natural Greyscale',
    background:  [[32, 25, 88]],
    colors: [[0, 0, 0, 85], [0, 0, 0 , 65], [0, 0, 0 , 50], [241, 1, 54, 40]],
  },
  {
    name: 'Azure Greyscale',
    background:  [[223, 44, 85]],
    colors: [[0, 0, 0, 85], [0, 0, 0 , 65], [0, 0, 0 , 50], [241, 1, 54, 40]],
  },
  {
    name: 'Candy Greyscale',
    background:  [[359, 48, 75]],
    colors: [[0, 0, 0, 85], [0, 0, 0 , 65], [0, 0, 0 , 50], [357, 59, 88, 90]],
  },
  {
    name: 'Pistachio Greyscale',
    background:  [[72, 23, 78]],
    colors: [[0, 0, 0, 85], [0, 0, 0 , 65], [0, 0, 0 , 50], [241, 1, 54, 40]],
  },
  {
    name: 'Citrine Greyscale',
    background:  [[36, 100, 44]],
    colors: [[0, 0, 0, 85], [0, 0, 0 , 65], [0, 0, 0 , 50], [357, 59, 88, 60]],
  },
  {
    name: 'Adriatic Greyscale',
    background:  [[214, 68, 40]],
    colors: [[0, 0, 0, 85], [0, 0, 0 , 65], [0, 0, 0 , 50], [357, 59, 88, 20]],
  },
  {
    name: 'Blue Overprint',
    background: [[223, 44, 85]],
    colors: [[202, 100, 37], [200, 72, 63], [221, 38, 39]],
  },
  {
    name: 'Lilac Overprint',
    background: [[282, 31, 70]],
    colors: [[287, 48, 64], [264, 49, 65], [261, 30, 51]],
  },
  {
    name: 'Pink Overprint',
    background: [[359, 48, 75]],
    colors: [[336, 53, 81], [353, 49, 54], [357, 59, 88, 90]],
  },
  {
    name: 'Vase',
    background: [[323, 40, 14]],
    colors: [[200, 72, 63, 50], [41, 100, 53, 50], [336, 53, 81, 50], [358, 100, 78, 50]],
  },
];

const BORDER_WIDTH_RATIO = 0.085; // ratio of the canvas width, note that 0.085 gives a 1.5 DRAWING_HEIGHT_RATIO
const BORDER_EXCLUDE = false; // whether to prohibit rendering dots in the border area
const BORDER_OVERLAY = true; // whether we redraw the border over whatever is in the border area at the end of each frame

const DOT_DENSITY = dotDensity || 400; // number of dots (on the x axis)
const DOT_SIZE = 1 / Math.sqrt(2) * (exportLayers === 'flat' ? 1.1 : 1); // the distance from the center of the dot to a corner - do not change
const DOT_SIZE_NOISE_DENSITY = 0.025; // the density of the Perlin noise that distorts the corners of the dots
const DOT_SIZE_NOISE_MAGNITUDE = exportLayers === 'flat' ? 0 : 0.25; // the magnitude of the Perlin noise that distorts the corners of the dots
const DOT_SIZE_GAUSSIAN_SD = exportLayers === 'flat' ? 0 : 0.15; // the standard deviation of the Gaussian noise that distorts the corners of the dots
const DOT_H_SD = 2; // the standard deviation of the Gaussian noise that affects the Hue of the dots
const DOT_S_SD = 2; // the standard deviation of the Gaussian noise that affects the Saturation of the dots
const DOT_L_SD = 2; // the standard deviation of the Gaussian noise that affects the Lightness of the dots
const DOT_ALPHA_SD = 10; // the standard deviation of the Gaussian noise that affects the Alpha of the dots
const DOT_PARTIAL_SIDE_GRANULARITY = 8; // the level of accuracy for calculating partial dots for smooth curve edges - do not change

const TILE_ZOOM_RATIO = chooseFromList([1, 1.3333, 2, 2.6667, 4, 5.3333, 8]); // the zoom of the Chladni tiles
const TILE_X_OFFSET = chooseFromList([0, 0.25, 0.5, 0.75]); // the x-offset of the Chladni tiles
const TILE_Y_OFFSET = chooseFromList([0, 0.25, 0.5, 0.75]); // the y-offset of the Chladni tiles

const ROTATION = randomUnit() < 0.33
  ? 0
  : chooseFromList([-81, -64, -49, -36, -25, -16, -9, 9, 16, 25, 36, 49, 64, 81]);

const PALETTE = chooseFromList(PALETTES);
const IS_MONOCHROME = PALETTE.colors.length === 1;
const RANGE_COUNT = chooseFromList([
  4, 6, // low
  12, 16, // med
  24, 32, // high
  128, // v high
]) + ((IS_MONOCHROME && randomUnit() < 0.5) ? 1 : 0) // to get different behaviour at end of ranges for IS_MONOCHROME

// TODO I'm mixing terminology of "layer" and "range"
const LAYER_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE = 0.1; // the maximum offset of the center of rotation of the layer from the center of the canvas (as a ratio of the width of the drawing)
const LAYER_MISREGISTRATION = IS_MONOCHROME ? 'NONE' : chooseFromList(['NONE', 'LOW', 'MEDIUM', 'HIGH']);
const LAYER_ROTATIONAL_OFFSET_MAX = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3
}[LAYER_MISREGISTRATION]; // the maximum rotation of a layer (in degrees)
const LAYER_TRANSLATIONAL_OFFSET_MAX_DISTANCE = {
  NONE: 0,
  LOW: 0.01,
  MEDIUM: 0.02,
  HIGH: 0.03
}[LAYER_MISREGISTRATION]; // the maximum offset of the center of the layer from the center of the canvas (as a ratio of the width of the drawing)

const LAYER_WIDTH_DISTRIBUTION = chooseFromList([
  'RANDOM',
  'UNIFORM',
  'ALTERNATE', // see LAYER_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR
  'INCREASING',
  'DECREASING',
  'ONE_THICK' // see LAYER_WIDTH_DISTRIBUTION_ONE_THICK_THICKNESS_FACTOR
]);
const LAYER_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR = 3;
const LAYER_WIDTH_DISTRIBUTION_ONE_THICK_THICKNESS_FACTOR = 6;

const LAYER_COLOR_RANGE_MIN = 0.2; // the minimum Chladni range for a layer - a smaller value gives narrower layers
const LAYER_COLOR_DISTRIBUTION = IS_MONOCHROME ? 'SMART_SHUFFLE' : chooseFromList([
  'SMART_SHUFFLE',

  'HSL_SORT_HUE',
  'HSL_ROTATE_HUE',
  'HSL_BOUNCE_HUE',

  'HSL_SORT_LIGHTNESS',
  'HSL_ROTATE_LIGHTNESS',
  'HSL_BOUNCE_LIGHTNESS',

  // 'DOMINANT'
]);

const COORDINATE_SYSTEM = chooseFromList(['CARTESIAN', 'POLAR']);
const POLAR_CENTER_X = chooseFromList([-0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5]) // TODO remove
const POLAR_CENTER_Y = chooseFromList([-0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]) // TODO remove

let shapes;
let layers;
let offscreenCanvas;

function setup() {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  colorMode(HSL, 360, 100, 100, 100);
  noStroke();
  background(...PALETTE.background);

  offscreenCanvas = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
  offscreenCanvas.colorMode(HSL, 360, 100, 100, 100);
  offscreenCanvas.noStroke();
  offscreenCanvas.blendMode(MULTIPLY);

  canvas.parent('sketch-canvas');
  randomSeed(randomUnit() * 1000);
  noiseSeed(randomUnit() * 1000)

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

  const ranges = (new Array(RANGE_COUNT)).fill(0).map(_ => ({ range: [] }))

  if (LAYER_COLOR_DISTRIBUTION === 'SMART_SHUFFLE') { // n.b. this can give all blank canvas if zoomed in on gap
    let previousColor = (IS_MONOCHROME && randomUnit() < 0.5) ? PALETTE.colors[0] : undefined;
    for (const range of ranges) {
      const newColor = chooseFromList(PALETTE.colors.filter(c => c !== previousColor))
      range.color = newColor;
      previousColor = newColor
    }
    if (!IS_MONOCHROME && PALETTE.accentColor != null) chooseFromList(ranges).color = PALETTE.accentColor;
  // } else if (LAYER_COLOR_DISTRIBUTION === 'DOMINANT') {
  //   const dominantColor = chooseFromList(PALETTE.colors);
  //   const colors = [...PALETTE.colors.filter(c => c !== dominantColor)];
  //   if (PALETTE.accentColor) colors.push(PALETTE.accentColor)
  //   while (colors.length < ranges.length) colors.push(dominantColor)
  //   shuffle(colors, true);
  //   for (let i = 0; i < colors.length; i++) ranges[i].color = colors[i]
  } else { // HSL
    const colors = (new Array(RANGE_COUNT)).fill(0);
    const hslIndex = LAYER_COLOR_DISTRIBUTION.includes('HUE') ? 0 : 2;
    const paletteColors = [...PALETTE.colors].sort((a, b) => a[hslIndex] - b[hslIndex]);
    let i = 0;
    if (LAYER_COLOR_DISTRIBUTION.includes('BOUNCE')) {
      let paletteIndex = 0;
      let isIncreasing = true;
      while (i < colors.length) {
        colors[i] = paletteColors[paletteIndex];
        if (paletteIndex === 0) {
          isIncreasing = true;
          paletteIndex = 1
        } else if (paletteIndex === paletteColors.length - 1) {
          isIncreasing = false;
          paletteIndex = paletteColors.length - 2
        } else {
          paletteIndex += (isIncreasing ? 1 : -1);
        }
        i++;
      }
    } else {
      while (i < colors.length) colors[i] = paletteColors[i++ % paletteColors.length]
      if (LAYER_COLOR_DISTRIBUTION.startsWith('HSL_SORT')) colors.sort((a, b) => a[hslIndex] - b[hslIndex])
    }
    for (let i = 0; i < RANGE_COUNT; i++) ranges[i].color = colors[i]
    if (!IS_MONOCHROME && PALETTE.accentColor != null) chooseFromList(ranges).color = PALETTE.accentColor;
  }

  const maxForColorRange = Math.abs(m) !== Math.abs(n)
    ? Math.abs(a) + Math.abs(b)
    : Math.abs(a + b)
  
  if (LAYER_WIDTH_DISTRIBUTION === 'UNIFORM') {
    for (let i = 0; i < ranges.length; i++) {
      ranges[i].range = [0, 1].map(v => -maxForColorRange + (i + v) * (2 * maxForColorRange) / ranges.length).map(toClosestTenth)
    }
  } else if (LAYER_WIDTH_DISTRIBUTION === 'ALTERNATE') {
    const tranchesWidth = 2 * maxForColorRange / (LAYER_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR + 1) * (Math.floor(ranges.length / 2)) + (ranges.length % 2);
    for (let i = 0; i < ranges.length; i++) {
      const startsAt = Math.floor(i / 2) * (LAYER_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR + 1) + i % 2;
      ranges[i].range = [startsAt, startsAt + ((i % 2 === 0) ? 1 : LAYER_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR)].map(v => -maxForColorRange + v * tranchesWidth).map(toClosestTenth)
    }
  } else {
    let getWidth;
    if (LAYER_WIDTH_DISTRIBUTION === 'RANDOM') {
      const toBeDivided = (2 * maxForColorRange) - (ranges.length * LAYER_COLOR_RANGE_MIN);
      const assignments = ranges.map(_ => randomUnit())
      getWidth = i => LAYER_COLOR_RANGE_MIN + assignments[i] * toBeDivided / assignments.reduce((acc, el) => acc + el);
    } else if (LAYER_WIDTH_DISTRIBUTION === 'ONE_THICK') {
      const ratios = ranges.map(_ => randomUnit());
      ratios[1 + Math.floor(randomUnit() * ranges.length - 2)] = Math.max(...ratios) * LAYER_WIDTH_DISTRIBUTION_ONE_THICK_THICKNESS_FACTOR;
      getWidth = i => 2 * maxForColorRange * ratios[i] / ratios.reduce((acc, el) => acc + el);
    } else { // 'INCREASING' or 'DECREASING'
      const min = LAYER_COLOR_RANGE_MIN;
      const max = 2 * (2 * maxForColorRange) / ranges.length - min;
      getWidth = i => min + (LAYER_WIDTH_DISTRIBUTION === 'INCREASING' ? i : ((ranges.length - 1) - i)) * (max - min) / (ranges.length - 1);
    }

    let start = -maxForColorRange;
    for (let i = 0; i < ranges.length; i++) {
      ranges[i].range = [start, start + getWidth(i)].map(toClosestTenth)
      start += getWidth(i)
    }
  }

  const noiseOffsets = (new Array(ranges.length)).fill(0).map(_ => randomUnit() * 1000)
  const offsets = (new Array(ranges.length)).fill(0).map(_ => ({ x: randomFloat(-LAYER_TRANSLATIONAL_OFFSET_MAX_DISTANCE, LAYER_TRANSLATIONAL_OFFSET_MAX_DISTANCE), y: randomFloat(-LAYER_TRANSLATIONAL_OFFSET_MAX_DISTANCE, LAYER_TRANSLATIONAL_OFFSET_MAX_DISTANCE) }))
  const angleOffsets = (new Array(ranges.length)).fill(0).map(_ => ({ angle: randomFloat(2 * PI * -LAYER_ROTATIONAL_OFFSET_MAX / 360, 2 * PI * LAYER_ROTATIONAL_OFFSET_MAX / 360), x: randomFloat(-LAYER_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE, LAYER_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE) + DRAWING_WIDTH_RATIO / 2, y: randomFloat(-LAYER_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE, LAYER_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE) + DRAWING_HEIGHT_RATIO / 2 }));
  shapes = (new Array(ranges.length)).fill(0).map(_ => []);

  // rotation around center of canvas
  const getChladni = (xOrig, yOrig) => {
    const xAngleCenter = DRAWING_WIDTH_RATIO / 2;
    const yAngleCenter = DRAWING_HEIGHT_RATIO / 2;
    const theta = atan2((xOrig - xAngleCenter), (yOrig - yAngleCenter));
    const distance = Math.sqrt((xOrig - xAngleCenter)**2 + (yOrig - yAngleCenter)**2);

    let x = xAngleCenter + sin(theta + (2 * Math.PI * ROTATION / 360)) * distance;
    let y = yAngleCenter + cos(theta + (2 * Math.PI * ROTATION / 360)) * distance;
    if (COORDINATE_SYSTEM === 'CARTESIAN') {
      x = (x - (TILE_X_OFFSET * TILE_ZOOM_RATIO + DRAWING_WIDTH_RATIO / 2)) / (0.5 * TILE_ZOOM_RATIO);
      y = (y - (TILE_Y_OFFSET * TILE_ZOOM_RATIO + DRAWING_HEIGHT_RATIO / 2)) / (0.5 * TILE_ZOOM_RATIO);
    } else {
      const xPolarCenter = TILE_X_OFFSET * TILE_ZOOM_RATIO + DRAWING_WIDTH_RATIO / 2;
      const yPolarCenter = TILE_Y_OFFSET * TILE_ZOOM_RATIO + DRAWING_HEIGHT_RATIO / 2;
      const polarTheta = atan2((x - xPolarCenter), (y - yPolarCenter));
      const polarDistance = Math.sqrt((x - xPolarCenter)**2 + (y - yPolarCenter)**2);

      x = polarDistance / (0.5 * TILE_ZOOM_RATIO);
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
            randomGaussian(color[3] ?? 70, DOT_ALPHA_SD),
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
            (BORDER_WIDTH_RATIO + DRAWING_TO_CANVAS_RATIO * x),
            (BORDER_WIDTH_RATIO + DRAWING_TO_CANVAS_RATIO * y),
          ])
        }

        shapes[rangeIndex].push(shape)
      }
    }
  }

  layers = {};
  for (let rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
    const color = ranges[rangeIndex].color;
    if (color == null) continue; // TODO needed?
    const colorKey = `${color.join('-')}`;
    layers[colorKey] = (layers[colorKey] ?? []).concat(shapes[rangeIndex])
  }

  // TODO - belts and braces check that if % of one color is too high then we retry the entire setup
}

function draw() {
  drawImage(this, offscreenCanvas, CANVAS_WIDTH, CANVAS_HEIGHT, frameCount);

  if (frameCount === 1) {
    if (exportLayers === 'mosaic' || exportLayers === 'flat') {
      for (const colorKey of Object.keys(layers)) {
        const shapes = layers[colorKey];
        const layer = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
        layer.colorMode(HSL, 360, 100, 100, 100);
        layer.pixelDensity(1)
        layer.noStroke();
        for (const shape of shapes) {
          if (exportLayers === 'mosaic') {
            layer.fill(0, 0, 0, shape.fill[3]);
          } else {
            layer.fill(0, 0, 0, 100);
          }
          layer.beginShape();
          for (const [x, y] of shape.vertexes) layer.vertex(x, y);
          layer.endShape()
        }
        save(layer, `${exportLayers}_${seed}_${frameCount}_${colorKey}.png`);
      }
    }

    noLoop();
    if (downloadIndexParam != null) {
      save(getFileName());
      if (downloadIndexParam > 1) {
        let url =
          `${window.location.protocol}//${window.location.host + window.location.pathname}?downloadIndex=${downloadIndexParam - 1}`;
        if (sizeQueryParam > 0) url += `&size=${sizeQueryParam}`;
        if (dotDensity > 0) url += `&tiledensity=${dotDensity}`;
        if (exportLayers) url += `&exportlayers=true`;
        setTimeout(() => window.location.href = url, 3000);
      }
    }
  }
}

function drawImage(canvas, offscreenCanvas, canvasWidth, canvasHeight) {
  for (const frames of Object.values(layers).reverse()) {
    for (const shape of frames) {
      offscreenCanvas.fill(...shape.fill);
      offscreenCanvas.beginShape();
      for (const [x, y] of shape.vertexes) offscreenCanvas.vertex(x * canvasWidth, y * canvasWidth);
      offscreenCanvas.endShape()
    }
  }

  canvas.image(offscreenCanvas, 0, 0)

  canvas.fill(...PALETTE.background);
  if (BORDER_OVERLAY) {
    canvas.rect(0, 0, canvasWidth, BORDER_WIDTH_RATIO * canvasWidth);
    canvas.rect(0, 0, BORDER_WIDTH_RATIO * canvasWidth, canvasHeight);
    canvas.rect(canvasWidth, canvasHeight, -canvasWidth, -BORDER_WIDTH_RATIO * canvasWidth);
    canvas.rect(canvasWidth, canvasHeight, -BORDER_WIDTH_RATIO * canvasWidth, -canvasHeight);
  }
}

keyPressed = () => {
  const rKeyCode = 82;
  const sKeyCode = 83;
  if (![rKeyCode, sKeyCode].includes(keyCode)) return;

  if (keyCode === rKeyCode) {
    let url =
      `${window.location.protocol}//${window.location.host + window.location.pathname}`;
    if (sizeQueryParam > 0 || dotDensity > 0)
      url += `?${[(sizeQueryParam > 0 ? `size=${sizeQueryParam}` : undefined),(dotDensity > 0 ? `tiledensity=${dotDensity}` : undefined)].filter(Boolean).join('&')}`;
    window.location.href = url
  } else if (keyCode === sKeyCode) {
    console.log(`Downloading print...`);
    const downloadWidth = DONWLOAD_PRINT_DIMENSION / CANVAS_HEIGHT_RATIO;
    const downloadHeight = DONWLOAD_PRINT_DIMENSION;

    const downloadContext = createGraphics(downloadWidth, downloadHeight);
    downloadContext.colorMode(HSL, 360, 100, 100, 100);
    downloadContext.pixelDensity(1);
    downloadContext.noStroke();
    downloadContext.background(...PALETTE.background);

    const downloadOffscreenContext = createGraphics(downloadWidth, downloadHeight);
    downloadOffscreenContext.colorMode(HSL, 360, 100, 100, 100);
    downloadOffscreenContext.pixelDensity(1);
    downloadOffscreenContext.noStroke();

    drawImage(downloadContext, downloadOffscreenContext, downloadWidth, downloadHeight);

    downloadContext.save(getFileName());

    console.log(`Download of print complete.`);
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

const DONWLOAD_PRINT_DIMENSION = 4000;

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

// misc

function toClosestTenth(input) {
  return Math.round(10 * input) / 10;
}

const getFileName = () => `resoriso-${PALETTE.name}-${originalSeed}-${downloadIndexParam}-${COORDINATE_SYSTEM}-${LAYER_MISREGISTRATION}-${TILE_ZOOM_RATIO}-${LAYER_WIDTH_DISTRIBUTION}-${LAYER_COLOR_DISTRIBUTION}-${RANGE_COUNT}.png`
