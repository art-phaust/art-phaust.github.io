/// random number generator
class Random {
  constructor() {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8, 8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    // seed prngA with first half of TOKEN_SEED
    this.prngA = new sfc32(TOKEN_SEED.substr(2, 32));
    // seed prngB with second half of TOKEN_SEED
    this.prngB = new sfc32(TOKEN_SEED.substr(34, 32));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  }
}

const R = new Random();

/// parameters
const getPaper = (name) => ({
  'Paper A': [32, 25, 88],
  'Paper B': [226, 27, 78],
  'Paper C': [357, 37, 79],
  'Paper D': [69, 19, 79],
  'Paper E': [42, 85, 52],
  'Paper F': [221, 35, 42],
  'Paper G': [285, 20, 20],
})[name];

const getInk = (name, alpha) => [...({
  'Ink A': [0, 0, 0],
  'Ink B': [336, 53, 81],
  'Ink C': [264, 49, 65],
  'Ink D': [241, 1, 54],
  'Ink E': [18, 100, 59],
  'Ink F': [354, 85, 63],
  'Ink G': [326, 100, 64],
  'Ink H': [183, 100, 32],
  'Ink I': [41, 100, 53],
  'Ink J': [178, 52, 68],
  'Ink K': [222, 53, 42],
  'Ink L': [324, 91, 75],
  'Ink M': [261, 30, 51],
  'Ink N': [202, 100, 37],
  'Ink O': [193, 72, 63],
  'Ink P': [358, 100, 78],
  'Ink Q': [20, 54, 48],
  'Ink R': [183, 100, 27],
  'Ink S': [357, 59, 88],
  'Ink T': [76, 19, 37],
  'Ink U': [36, 27, 55],
  'Ink V': [24, 64, 45],
  'Ink W': [210, 1, 54],
  'Ink X': [353, 49, 54],
  'Ink Y': [221, 38, 39],
}[name]), alpha].filter(v => v != null);

const PALETTES = [
  {
    name: 'Breaking News',
    probability: 0.06,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink A', 85), getInk('Ink A', 65), getInk('Ink A', 50), getInk('Ink D', 40)],
    accentColor: getInk('Ink E', 100),
  },
  {
    name: 'Spectrum',
    probability: 0.06,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink F'), getInk('Ink G'), getInk('Ink H'), getInk('Ink I'), getInk('Ink E'), getInk('Ink K')],
  },
  {
    name: 'Bubblegum Sun',
    probability: 0.06,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink K'), getInk('Ink I'), getInk('Ink L')],
  },
  {
    name: 'Tokyo Nights',
    probability: 0.06,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink A'), getInk('Ink N'), getInk('Ink O'), getInk('Ink G')],
  },
  {
    name: 'Coral',
    probability: 0.06,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink O'), getInk('Ink N'), getInk('Ink K'), getInk('Ink P')],
  },
  {
    name: 'Kingfisher',
    probability: 0.06,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink Q'), getInk('Ink R'), getInk('Ink H'), getInk('Ink S')],
  },
  {
    name: 'Ficus',
    probability: 0.06,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink T'), getInk('Ink U'), getInk('Ink V'), getInk('Ink W')],
  },
  {
    name: 'Rust',
    probability: 0.06,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink Q'), getInk('Ink X'), getInk('Ink U'), getInk('Ink Y')],
  },
  {
    name: 'Roller Disco',
    probability: 0.06,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink J'), getInk('Ink I'), getInk('Ink G'), getInk('Ink C')],
  },
  {
    name: 'Hyacinth',
    probability: 0.03,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink M'), getInk('Ink O')],
  },
  {
    name: 'Watermelon',
    probability: 0.03,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink G'), getInk('Ink R')],
  },
  {
    name: 'Flamingo',
    probability: 0.03,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink L'), getInk('Ink N')],
  },
  {
    name: 'Black',
    probability: 0.03,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink A')],
  },
  {
    name: 'Blue',
    probability: 0.03,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink K')],
  },
  {
    name: 'Sunflower',
    probability: 0.03,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink I')],
  },
  {
    name: 'Natural Greyscale',
    probability: 0.03,
    paper: getPaper('Paper A'),
    colors: [getInk('Ink A', 85), getInk('Ink A', 65), getInk('Ink A', 50), getInk('Ink D', 40)],
  },
  {
    name: 'Azure Greyscale',
    probability: 0.03,
    paper: getPaper('Paper B'),
    colors: [getInk('Ink A', 85), getInk('Ink A', 65), getInk('Ink A', 50), getInk('Ink D', 40)],
  },
  {
    name: 'Candy Greyscale',
    probability: 0.03,
    paper: getPaper('Paper C'),
    colors: [getInk('Ink A', 85), getInk('Ink A', 65), getInk('Ink A', 50), getInk('Ink S', 90)],
  },
  {
    name: 'Pistachio Greyscale',
    probability: 0.03,
    paper: getPaper('Paper D'),
    colors: [getInk('Ink A', 85), getInk('Ink A', 65), getInk('Ink A', 50), getInk('Ink D', 40)],
  },
  {
    name: 'Citrine Greyscale',
    probability: 0.03,
    paper: getPaper('Paper E'),
    colors: [getInk('Ink A', 85), getInk('Ink A', 65), getInk('Ink A', 50), getInk('Ink S', 60)],
  },
  {
    name: 'Adriatic Greyscale',
    probability: 0.03,
    paper: getPaper('Paper F'),
    colors: [getInk('Ink A', 85), getInk('Ink A', 65), getInk('Ink A', 50), getInk('Ink S', 40)],
  },
  {
    name: 'Ocean',
    probability: 0.03,
    paper: getPaper('Paper B'),
    colors: [getInk('Ink N'), getInk('Ink O'), getInk('Ink Y')],
  },
  {
    name: 'Floss',
    probability: 0.03,
    paper: getPaper('Paper C'),
    colors: [getInk('Ink B'), getInk('Ink X'), getInk('Ink S')],
  },
  {
    name: 'Vase',
    probability: 0.03,
    paper: getPaper('Paper G'),
    colors: [getInk('Ink O', 50), getInk('Ink I', 50), getInk('Ink B', 50), getInk('Ink P', 50)],
  },
];

const BORDER_WIDTH_RATIO = 0.02; // ratio of the canvas width, note that 0.085 gives a 1.5 DRAWING_HEIGHT_RATIO
const BORDER_OVERLAY = true; // whether we redraw the border over whatever is in the border area at the end of each frame

const DOT_DENSITY = dotDensity || 600; // number of dots (on the x axis)
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
const CONTOUR_COUNT = chooseFromList([
  4, 8, // low
  12, 16, // med
  24, 32, // high
  64, 128, // v high
]) + ((IS_MONOCHROME && randomUnit() < 0.5) ? 1 : 0) // to get different behaviour at end of contours for IS_MONOCHROME

const CONTOUR_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE = 0.1; // the maximum offset of the center of rotation of the contour from the center of the canvas (as a ratio of the width of the drawing)
const CONTOUR_MISREGISTRATION = IS_MONOCHROME ? 'NONE' : chooseByProbability([
  { value: 'NONE', probability: 0.1 },
  { value: 'LOW', probability: 0.3},
  { value: 'MEDIUM', probability: 0.3 },
  { value: 'HIGH', probability: 0.3 }
]).value;
const CONTOUR_ROTATIONAL_OFFSET_MAX = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3
}[CONTOUR_MISREGISTRATION]; // the maximum rotation of a contour (in degrees)
const CONTOUR_TRANSLATIONAL_OFFSET_MAX_DISTANCE = {
  NONE: 0,
  LOW: 0.01,
  MEDIUM: 0.02,
  HIGH: 0.03
}[CONTOUR_MISREGISTRATION]; // the maximum offset of the center of the contour from the center of the canvas (as a ratio of the width of the drawing)

const CONTOUR_WIDTH_DISTRIBUTION = chooseFromList([
  'RANDOM',
  'UNIFORM',
  'ALTERNATE', // see CONTOUR_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR
  'INCREASING',
  'DECREASING',
  'ONE_THICK' // see CONTOUR_WIDTH_DISTRIBUTION_ONE_THICK_THICKNESS_FACTOR
]);
const CONTOUR_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR = 3;
const CONTOUR_WIDTH_DISTRIBUTION_ONE_THICK_THICKNESS_FACTOR = 6;

const CONTOUR_COLOR_RANGE_MIN = 0.2; // the minimum Chladni range for a contour - a smaller value gives narrower contours
const CONTOUR_COLOR_DISTRIBUTION = IS_MONOCHROME ? 'SMART_SHUFFLE' : chooseByProbability([
  { value: 'SMART_SHUFFLE', probability: 0.49 },

  { value: 'HSL_SORT_HUE', probability: 0.17 },
  { value: 'HSL_ROTATE_HUE', probability: 0.17 },
  { value: 'HSL_BOUNCE_HUE', probability: 0.17 },
]).value;

const BLEND_MODE_MULTIPLY_FACTOR = 0.8

const COORDINATE_SYSTEM = chooseByProbability([{ value: 'CARTESIAN', probability: 0.5 }, { value: 'POLAR', probability: 0.25 }, { value: 'POLAR_BUGGED', probability: 0.25 }]).value;

/// shared variables
let shapes;
let layers;
let offscreenCanvas;

/// p5.js methods
function setup() {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  colorMode(HSL, 360, 100, 100, 100);
  noStroke();
  background(...PALETTE.paper);

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

  const contours = (new Array(CONTOUR_COUNT)).fill(0).map(_ => ({ range: [] }))

  if (CONTOUR_COLOR_DISTRIBUTION === 'SMART_SHUFFLE') { // n.b. this can give all blank canvas if zoomed in on gap
    let previousColor = (IS_MONOCHROME && randomUnit() < 0.5) ? PALETTE.colors[0] : undefined;
    for (const contour of contours) {
      const newColor = chooseFromList(PALETTE.colors.filter(c => c !== previousColor))
      contour.color = newColor;
      previousColor = newColor
    }
    if (!IS_MONOCHROME && PALETTE.accentColor != null) chooseFromList(contours).color = PALETTE.accentColor;
  } else { // HSL
    const colors = (new Array(CONTOUR_COUNT)).fill(0);
    const hslIndex = CONTOUR_COLOR_DISTRIBUTION.includes('HUE') ? 0 : 2;
    const paletteColors = [...PALETTE.colors].sort((a, b) => a[hslIndex] - b[hslIndex]);
    let i = 0;
    if (CONTOUR_COLOR_DISTRIBUTION.includes('BOUNCE')) {
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
      if (CONTOUR_COLOR_DISTRIBUTION.startsWith('HSL_SORT')) colors.sort((a, b) => a[hslIndex] - b[hslIndex])
    }
    for (let i = 0; i < CONTOUR_COUNT; i++) contours[i].color = colors[i]
    if (!IS_MONOCHROME && PALETTE.accentColor != null) chooseFromList(contours).color = PALETTE.accentColor;
  }

  const maxForCountours = Math.abs(m) !== Math.abs(n)
    ? Math.abs(a) + Math.abs(b)
    : Math.abs(a + b)
  
  if (CONTOUR_WIDTH_DISTRIBUTION === 'UNIFORM') {
    for (let i = 0; i < contours.length; i++) {
      contours[i].range = [0, 1].map(v => -maxForCountours + (i + v) * (2 * maxForCountours) / contours.length).map(toClosestTenth)
    }
  } else if (CONTOUR_WIDTH_DISTRIBUTION === 'ALTERNATE') {
    const tranchesWidth = 2 * maxForCountours / ((CONTOUR_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR + 1) * (Math.floor(contours.length / 2)) + (contours.length % 2));
    for (let i = 0; i < contours.length; i++) {
      const startsAt = Math.floor(i / 2) * (CONTOUR_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR + 1) + i % 2;
      contours[i].range = [startsAt, startsAt + ((i % 2 === 0) ? 1 : CONTOUR_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR)].map(v => -maxForCountours + v * tranchesWidth).map(toClosestTenth)
    }
  } else {
    let getWidth;
    if (CONTOUR_WIDTH_DISTRIBUTION === 'RANDOM') {
      const toBeDivided = (2 * maxForCountours) - (contours.length * CONTOUR_COLOR_RANGE_MIN);
      const assignments = contours.map(_ => randomUnit())
      getWidth = i => CONTOUR_COLOR_RANGE_MIN + assignments[i] * toBeDivided / assignments.reduce((acc, el) => acc + el);
    } else if (CONTOUR_WIDTH_DISTRIBUTION === 'ONE_THICK') {
      const ratios = contours.map(_ => randomUnit());
      ratios[1 + Math.floor(randomUnit() * contours.length - 2)] = Math.max(...ratios) * CONTOUR_WIDTH_DISTRIBUTION_ONE_THICK_THICKNESS_FACTOR;
      getWidth = i => 2 * maxForCountours * ratios[i] / ratios.reduce((acc, el) => acc + el);
    } else { // 'INCREASING' or 'DECREASING'
      const min = CONTOUR_COLOR_RANGE_MIN;
      const max = 2 * (2 * maxForCountours) / contours.length - min;
      getWidth = i => min + (CONTOUR_WIDTH_DISTRIBUTION === 'INCREASING' ? i : ((contours.length - 1) - i)) * (max - min) / (contours.length - 1);
    }

    let start = -maxForCountours;
    for (let i = 0; i < contours.length; i++) {
      contours[i].range = [start, start + getWidth(i)].map(toClosestTenth)
      start += getWidth(i)
    }
  }

  const noiseOffsets = (new Array(contours.length)).fill(0).map(_ => randomUnit() * 1000)
  const offsets = (new Array(contours.length)).fill(0).map(_ => ({ x: randomFloat(-CONTOUR_TRANSLATIONAL_OFFSET_MAX_DISTANCE, CONTOUR_TRANSLATIONAL_OFFSET_MAX_DISTANCE), y: randomFloat(-CONTOUR_TRANSLATIONAL_OFFSET_MAX_DISTANCE, CONTOUR_TRANSLATIONAL_OFFSET_MAX_DISTANCE) }))
  const angleOffsets = (new Array(contours.length)).fill(0).map(_ => ({ angle: randomFloat(2 * PI * -CONTOUR_ROTATIONAL_OFFSET_MAX / 360, 2 * PI * CONTOUR_ROTATIONAL_OFFSET_MAX / 360), x: randomFloat(-CONTOUR_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE, CONTOUR_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE) + DRAWING_WIDTH_RATIO / 2, y: randomFloat(-CONTOUR_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE, CONTOUR_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE) + DRAWING_HEIGHT_RATIO / 2 }));
  shapes = (new Array(contours.length)).fill(0).map(_ => []);

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
      y = ((polarTheta - Math.PI) / (Math.PI * (COORDINATE_SYSTEM === 'POLAR_BUGGED' ? 0.75 : 1)));
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
      let contourIndexesSet = new Set();
      for (let k = 0; k < 4; k++) {
        const angle = Math.PI / 4 + k * 2 * PI / 4;
        const cornerX = baseX + sin(angle) * DOT_SIZE / DOT_DENSITY;
        const cornerY = baseY + cos(angle) * DOT_SIZE / DOT_DENSITY;
        const chladniValue = getChladni(cornerX, cornerY);
        const contourIndex = contours.findIndex(({ range }) => range[0] <= chladniValue && range[1] >= chladniValue);
        contourIndexesSet.add(contourIndex);
        corners.push({ x: cornerX, y: cornerY, contourIndex, angle, distance: DOT_SIZE / DOT_DENSITY });
      }

      for (const contourIndex of Array.from(contourIndexesSet)) {
        const color = contours[contourIndex]?.color;

        if (color == null) continue;

        const mids = [];
        for (let cornerIndex = 0; cornerIndex < 4; cornerIndex++) {
          let mid = undefined;
          const corner = corners[cornerIndex];
          const nextCorner = corners[(cornerIndex + 1) % 4];
          if ((corner.contourIndex === contourIndex || nextCorner.contourIndex === contourIndex) && corner.contourIndex !== nextCorner.contourIndex) {
            const xDiff = nextCorner.x - corner.x;
            const yDiff = nextCorner.y - corner.y;
            for (let q = 1; q < DOT_PARTIAL_SIDE_GRANULARITY; q++) {
              const newX = corner.x + (q / DOT_PARTIAL_SIDE_GRANULARITY) * xDiff;
              const newY = corner.y + (q / DOT_PARTIAL_SIDE_GRANULARITY) * yDiff;
              const newChladniValue = getChladni(newX, newY);
              const newcontourIndex = contours.findIndex(({ range }) => range[0] <= newChladniValue && range[1] >= newChladniValue);
              if (
                (corner.contourIndex === contourIndex && ((newcontourIndex !== contourIndex) || q === DOT_PARTIAL_SIDE_GRANULARITY - 1)) ||
                (corner.contourIndex !== contourIndex && ((newcontourIndex === contourIndex) || q === DOT_PARTIAL_SIDE_GRANULARITY - 1))
              ) { // q === DOT_PARTIAL_SIDE_GRANULARITY - 1 is a small hack
                const angle = atan2(newX - baseX, newY - baseY);
                const distance = Math.sqrt((newX - baseX)**2 + (newY - baseY)**2);
                mid = { x: newX, y: newY, contourIndex, angle, distance };
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
            randomGaussian(color[3] ?? 80, DOT_ALPHA_SD),
          ],
          vertexes: []
        }

        const { angle: angleOffset, x: xAngleCenter, y: yAngleCenter } = angleOffsets[contourIndex];
        const theta = atan2((baseX - xAngleCenter), (baseY - yAngleCenter));
        const distance = Math.sqrt((baseX - xAngleCenter)**2 + (baseY - yAngleCenter)**2);

        const xRotated = xAngleCenter + sin(theta - angleOffset) * distance + (offsets[contourIndex]?.x ?? 0);
        const yRotated = yAngleCenter + cos(theta - angleOffset) * distance + (offsets[contourIndex]?.y ?? 0);

        const noiseValue = noise(i * DOT_SIZE_NOISE_DENSITY + noiseOffsets[contourIndex], j * DOT_SIZE_NOISE_DENSITY + noiseOffsets[contourIndex]) - 0.5;

        const vertexes = []
        for (let i = 0; i < 4; i++) {
          for (let vertex of [corners[i], mids[i]]) {
            if (!(vertex == null || vertex.contourIndex !== contourIndex)) vertexes.push(vertex);
          }
        }

        for (const vertex of vertexes) {
          const dotDistortionX = 1 + noiseValue * DOT_SIZE_NOISE_MAGNITUDE + randomGaussian(0, DOT_SIZE_GAUSSIAN_SD);
          const dotDistortionY = 1 + noiseValue * DOT_SIZE_NOISE_MAGNITUDE + randomGaussian(0, DOT_SIZE_GAUSSIAN_SD);

          const x = xRotated + sin(vertex.angle) * dotDistortionX * vertex.distance;
          const y = yRotated + cos(vertex.angle) * dotDistortionY * vertex.distance;
          shape.vertexes.push([
            (BORDER_WIDTH_RATIO + DRAWING_TO_CANVAS_RATIO * x),
            (BORDER_WIDTH_RATIO + DRAWING_TO_CANVAS_RATIO * y),
          ])
        }

        shapes[contourIndex].push(shape)
      }
    }
  }

  layers = {};
  for (let contourIndex = 0; contourIndex < contours.length; contourIndex++) {
    const color = contours[contourIndex].color;
    if (color == null) continue; // TODO needed?
    const colorKey = `${color.join('-')}`;
    layers[colorKey] = (layers[colorKey] ?? []).concat(shapes[contourIndex])
  }

  // TODO - belts and braces check that if % of one color is too high then we retry the entire setup
}

function draw() {
  drawImage(this, offscreenCanvas, CANVAS_WIDTH, CANVAS_HEIGHT, frameCount);

  if (frameCount === Object.keys(layers).length) {
    noLoop();

    // TODO remove for release
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
          for (const [x, y] of shape.vertexes) layer.vertex(x * CANVAS_WIDTH, y * CANVAS_WIDTH);
          layer.endShape()
        }
        const outputLayer = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
        outputLayer.colorMode(HSL, 360, 100, 100, 100);
        outputLayer.pixelDensity(1);
        outputLayer.image(
          layer,
          BORDER_WIDTH_RATIO * CANVAS_WIDTH,
          BORDER_WIDTH_RATIO * CANVAS_WIDTH,
          CANVAS_WIDTH - 2 * BORDER_WIDTH_RATIO * CANVAS_WIDTH,
          CANVAS_HEIGHT - 2 * BORDER_WIDTH_RATIO * CANVAS_WIDTH,
          BORDER_WIDTH_RATIO * CANVAS_WIDTH,
          BORDER_WIDTH_RATIO * CANVAS_WIDTH,
          CANVAS_WIDTH - 2 * BORDER_WIDTH_RATIO * CANVAS_WIDTH,
          CANVAS_HEIGHT - 2 * BORDER_WIDTH_RATIO * CANVAS_WIDTH,
        );
        save(outputLayer, `${exportLayers}${TOKEN_SEED}${frameCount}_${colorKey}.png`);
      }
    }

    // TODO remove for release
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

function drawImage(canvas, offscreenCanvas, canvasWidth, canvasHeight, frameCountToDraw) {
  canvas.background(...PALETTE.paper);

  const framesToDraw = (frameCountToDraw == null) ? Object.values(layers) : [layers[Object.keys(layers)[frameCountToDraw - 1]]]

  if (BLEND_MODE_MULTIPLY_FACTOR > 0) {
    offscreenCanvas.blendMode(MULTIPLY)
    for (const frames of framesToDraw) {
      for (const shape of frames) {
        offscreenCanvas.fill(shape.fill[0], shape.fill[1], shape.fill[2], shape.fill[3] * BLEND_MODE_MULTIPLY_FACTOR);
        offscreenCanvas.beginShape();
        for (const [x, y] of shape.vertexes) offscreenCanvas.vertex(x * canvasWidth, y * canvasWidth);
        offscreenCanvas.endShape()
      }
    }
  } 
  if (BLEND_MODE_MULTIPLY_FACTOR < 1) {
    offscreenCanvas.blendMode(BLEND)
    for (const frames of framesToDraw) {
      for (const shape of frames) {
        offscreenCanvas.fill(shape.fill[0], shape.fill[1], shape.fill[2], shape.fill[3] * (1 - BLEND_MODE_MULTIPLY_FACTOR));
        offscreenCanvas.beginShape();
        for (const [x, y] of shape.vertexes) offscreenCanvas.vertex(x * canvasWidth, y * canvasWidth);
        offscreenCanvas.endShape()
      }
    }
  }

  canvas.image(offscreenCanvas, 0, 0)

  if (BORDER_OVERLAY) {
    canvas.fill(...PALETTE.paper);
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
    downloadContext.background(...PALETTE.paper);

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
  return R.random_dec();
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

// TODO change this for release
const getFileName = () => `resoriso-${PALETTE.name}-${TOKEN_SEED}${downloadIndexParam != null ? `-${downloadIndexParam}` : ''}.png`