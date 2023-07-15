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

let R = new Random(); // PLAYGROUND

/// parameters
const PALETTES = [
  {
    paperIndex: 0,
    colorCodes: [[0, 0.85], [0, 0.65], [0, 0.85], [3, 0.4]],
    accentColorCode: [4, 1],
  },
  {
    paperIndex: 0,
    colorCodes: [5, 6, 7, 8, 4, 10],
  },
  {
    paperIndex: 0,
    colorCodes: [10, 8, 11],
  },
  {
    paperIndex: 0,
    colorCodes: [0, 13, 14, 6],
  },
  {
    paperIndex: 0,
    colorCodes: [14, 13, 10, 15],
  },
  {
    paperIndex: 0,
    colorCodes: [16, 17, 7, 18],
  },
  {
    paperIndex: 0,
    colorCodes: [19, 20, 16, 3],
  },
  {
    paperIndex: 0,
    colorCodes: [16, 21, 20, 22],
  },
  {
    paperIndex: 0,
    colorCodes: [9, 8, 6, 2],
  },
  {
    paperIndex: 0,
    colorCodes: [12, 14],
  },
  {
    paperIndex: 0,
    colorCodes: [6, 17],
  },
  {
    paperIndex: 0,
    colorCodes: [11, 13],
  },
  {
    paperIndex: 0,
    colorCodes: [0],
  },
  {
    paperIndex: 0,
    colorCodes: [10],
  },
  {
    paperIndex: 0,
    colorCodes: [8],
  },
  {
    paperIndex: 0,
    colorCodes: [[0, 0.85], [0, 0.65], [0, 0.5], [3, 0.4]],
  },
  {
    paperIndex: 1,
    colorCodes: [[0, 0.85], [0, 0.65], [0, 0.5], [3, 0.4]],
  },
  {
    paperIndex: 2,
    colorCodes: [[0, 0.85], [0, 0.65], [0, 0.5], [18, 0.9]],
  },
  {
    paperIndex: 3,
    colorCodes: [[0, 0.85], [0, 0.65], [0, 0.5], [3, 0.4]],
  },
  {
    paperIndex: 4,
    colorCodes: [[0, 0.85], [0, 0.65], [0, 0.5], [18, 0.6]],
  },
  {
    paperIndex: 5,
    colorCodes: [[0, 0.85], [0, 0.65], [0, 0.5], [18, 0.4]],
  },
  {
    paperIndex: 1,
    colorCodes: [13, 14, 22],
  },
  {
    paperIndex: 2,
    colorCodes: [1, 21, 18],
  },
  {
    paperIndex: 5,
    colorCodes: [[14, 0.5], [8, 0.5], [1, 0.5], [15, 0.5]],
  },
];
const PAPERS = [
  [32, 25, 88],
  [226, 27, 78],
  [357, 37, 79],
  [69, 19, 79],
  [42, 85, 52],
  [221, 35, 42],
  [285, 20, 20],
];
const COLORS = [
  [0, 0, 0],
  [336, 53, 81],
  [264, 49, 65],
  [241, 1, 54],
  [18, 100, 59],
  [354, 85, 63],
  [326, 100, 64],
  [183, 100, 32],
  [41, 100, 53],
  [178, 52, 68],
  [222, 53, 42],
  [324, 91, 75],
  [261, 30, 51],
  [202, 100, 37],
  [193, 72, 63],
  [358, 100, 78],
  [20, 54, 48],
  [183, 100, 27],
  [357, 59, 88],
  [76, 19, 37],
  [36, 27, 55],
  [353, 49, 54],
  [221, 38, 39],
];
PALETTES.forEach(palette => {
  palette.paper = PAPERS[palette.paperIndex];
  palette.colors = palette.colorCodes.map(c => Array.isArray(c) ? [...COLORS[c[0]], c[1]] : COLORS[c])
  if (palette.accentColorCode != null) palette.accentColor = Array.isArray(palette.accentColorCode) ? [...COLORS[palette.accentColorCode[0]], palette.accentColorCode[1]] : COLORS[palette.accentColorCode]
})

const BORDER_WIDTH_RATIO = 0.02; // ratio of the canvas width, note that 0.085 gives a 1.5 DRAWING_HEIGHT_RATIO
const BORDER_OVERLAY = true; // whether we redraw the border over whatever is in the border area at the end of each frame

const DOT_DENSITY = 600; // number of dots (on the x axis)
const DOT_SIZE = 1 / Math.sqrt(2); // the distance from the center of the dot to a corner - do not change
const DOT_SIZE_NOISE_DENSITY = 0.025; // the density of the Perlin noise that distorts the corners of the dots
const DOT_SIZE_NOISE_MAGNITUDE = 0.25; // the magnitude of the Perlin noise that distorts the corners of the dots
const DOT_SIZE_GAUSSIAN_SD = 0.15; // the standard deviation of the Gaussian noise that distorts the corners of the dots
const DOT_H_SD = 2; // the standard deviation of the Gaussian noise that affects the Hue of the dots
const DOT_S_SD = 2; // the standard deviation of the Gaussian noise that affects the Saturation of the dots
const DOT_L_SD = 2; // the standard deviation of the Gaussian noise that affects the Lightness of the dots
const DOT_ALPHA_SD = 0.1; // the standard deviation of the Gaussian noise that affects the Alpha of the dots
const DOT_PARTIAL_SIDE_GRANULARITY = 8; // the level of accuracy for calculating partial dots for smooth curve edges - do not change

const TILE_ZOOM_RATIOS = [1, 1.3333, 2, 2.6667, 4, 5.3333, 8];
const CONTOUR_COUNTS = [
  4, 8, // low
  12, 16, // med
  24, 32, // high
  64, 128, // v high
];

const CONTOUR_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE = 0.1; // the maximum offset of the center of rotation of the contour from the center of the canvas (as a ratio of the width of the drawing)

const CONTOUR_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR = 3;
const CONTOUR_WIDTH_DISTRIBUTION_ONE_THICK_THICKNESS_FACTOR = 6;

const CONTOUR_COLOR_RANGE_MIN = 0.2; // the minimum Chladni range for a contour - a smaller value gives narrower contours

const BLEND_MODE_MULTIPLY_FACTOR = 0.8

let tileZoomRatioIndex;
let tileZoomRatio;
let tileXOffset;
let tileYOffset;
let rotation;
let paletteIndex;
let palette;
let isMonochrome;
let contourCountIndex;
let contourCount;
let contourMisregistrationIndex;
let contourRotationalOffsetMax;
let contourTranslationalOffsetMaxDistance;
let contourWidthDistribution;
let contourColorDistributionIndex;
let coordinateSystemIndex;

/// shared variables
let shapes;
let layers;
let offscreenCanvas;
let frameCountOffset = 0;

function initialiseVariables() {
  tileZoomRatioIndex = Math.floor(randomUnit() * TILE_ZOOM_RATIOS.length);
  tileZoomRatio = TILE_ZOOM_RATIOS[tileZoomRatioIndex]; // the zoom of the Chladni tiles
  tileXOffset = chooseFromList([0, 0.25, 0.5, 0.75]); // the x-offset of the Chladni tiles
  tileYOffset = chooseFromList([0, 0.25, 0.5, 0.75]); // the y-offset of the Chladni tiles

  rotation = randomUnit() < 0.33
    ? 0
    : chooseFromList([-81, -64, -49, -36, -25, -16, -9, 9, 16, 25, 36, 49, 64, 81]);

  paletteIndex = Math.floor(randomUnit() * PALETTES.length);
  palette = PALETTES[paletteIndex];
  isMonochrome = palette.colors.length === 1;

  contourCountIndex = Math.floor(randomUnit() * CONTOUR_COUNTS.length);
  contourCount = CONTOUR_COUNTS[contourCountIndex] + ((isMonochrome && randomUnit() < 0.5) ? 1 : 0) // to get different behaviour at end of contours for isMonochrome

  contourMisregistrationIndex = isMonochrome ? 0 : chooseByProbability([
    { probability: 0.1 },
    { probability: 0.3},
    { probability: 0.3 },
    { probability: 0.3 }
  ]);
  contourRotationalOffsetMax = contourMisregistrationIndex; // the maximum rotation of a contour (in degrees)
  contourTranslationalOffsetMaxDistance = 0.01 * contourMisregistrationIndex; // the maximum offset of the center of the contour from the center of the canvas (as a ratio of the width of the drawing)

  contourWidthDistribution = Math.floor(6 * randomUnit())
  // 0: RANDOM
  // 1: UNIFORM
  // 2: ALTERNATE // see CONTOUR_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR
  // 3: INCREASING
  // 4: DECREASING
  // 5: ONE_THICK // see CONTOUR_WIDTH_DISTRIBUTION_ONE_THICK_THICKNESS_FACTOR

  contourColorDistributionIndex = isMonochrome ? 0 : chooseByProbability([
    { probability: 0.49 }, // SHUFFLE
    { probability: 0.17 }, // SORT
    { probability: 0.17 }, // ROTATE
    { probability: 0.17 }, // BOUNCE
  ])

  coordinateSystemIndex = chooseByProbability([
    { probability: 0.5 }, // CARTESIAN
    { probability: 0.25 }, // POLAR
    { probability: 0.25 } // POLAR_DIST
  ]);
}

function initialiseData() {
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

  const contours = (new Array(contourCount)).fill(0).map(_ => ({ range: [] }))

  if (contourColorDistributionIndex === 0) { // SHUFFLE, n.b. this can give all blank canvas if zoomed in on gap
    let previousColor = (isMonochrome && randomUnit() < 0.5) ? palette.colors[0] : undefined;
    for (const contour of contours) {
      const newColor = chooseFromList(palette.colors.filter(c => c !== previousColor))
      contour.color = newColor;
      previousColor = newColor
    }
    if (!isMonochrome && palette.accentColor != null) chooseFromList(contours).color = palette.accentColor;
  } else { // SORT, ROTATE, BOUNCE
    const colors = (new Array(contourCount)).fill(0);
    const hslIndex = 0;
    const paletteColors = [...palette.colors].sort((a, b) => a[hslIndex] - b[hslIndex]);
    let i = 0;
    if (contourColorDistributionIndex === 3) { // BOUNCE
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
      if (contourColorDistributionIndex == 1) colors.sort((a, b) => a[hslIndex] - b[hslIndex]) // SORT
    }
    for (let i = 0; i < contourCount; i++) contours[i].color = colors[i]
    if (!isMonochrome && palette.accentColor != null) chooseFromList(contours).color = palette.accentColor;
  }

  const maxForCountours = Math.abs(m) !== Math.abs(n)
    ? Math.abs(a) + Math.abs(b)
    : Math.abs(a + b)
  
  if (contourWidthDistribution === 1) { // UNIFORM
    for (let i = 0; i < contours.length; i++) {
      contours[i].range = [0, 1].map(v => -maxForCountours + (i + v) * (2 * maxForCountours) / contours.length).map(toClosestTenth)
    }
  } else if (contourWidthDistribution === 2) { // ALTERNATE
    const tranchesWidth = 2 * maxForCountours / ((CONTOUR_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR + 1) * (Math.floor(contours.length / 2)) + (contours.length % 2));
    for (let i = 0; i < contours.length; i++) {
      const startsAt = Math.floor(i / 2) * (CONTOUR_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR + 1) + i % 2;
      contours[i].range = [startsAt, startsAt + ((i % 2 === 0) ? 1 : CONTOUR_WIDTH_DISTRIBUTION_ALTERNATIVE_THICKNESS_FACTOR)].map(v => -maxForCountours + v * tranchesWidth).map(toClosestTenth)
    }
  } else {
    let getWidth;
    if (contourWidthDistribution === 0) { // RANDOM
      const toBeDivided = (2 * maxForCountours) - (contours.length * CONTOUR_COLOR_RANGE_MIN);
      const assignments = contours.map(_ => randomUnit())
      getWidth = i => CONTOUR_COLOR_RANGE_MIN + assignments[i] * toBeDivided / assignments.reduce((acc, el) => acc + el);
    } else if (contourWidthDistribution === 5) { // ONE_THICK
      const ratios = contours.map(_ => randomUnit());
      ratios[1 + Math.floor(randomUnit() * contours.length - 2)] = Math.max(...ratios) * CONTOUR_WIDTH_DISTRIBUTION_ONE_THICK_THICKNESS_FACTOR;
      getWidth = i => 2 * maxForCountours * ratios[i] / ratios.reduce((acc, el) => acc + el);
    } else { // 'INCREASING' (3) or 'DECREASING' (4)
      const min = CONTOUR_COLOR_RANGE_MIN;
      const max = 2 * (2 * maxForCountours) / contours.length - min;
      getWidth = i => min + (contourWidthDistribution === 3 ? i : ((contours.length - 1) - i)) * (max - min) / (contours.length - 1);
    }

    let start = -maxForCountours;
    for (let i = 0; i < contours.length; i++) {
      contours[i].range = [start, start + getWidth(i)].map(toClosestTenth)
      start += getWidth(i)
    }
  }

  const noiseOffsets = (new Array(contours.length)).fill(0).map(_ => randomUnit() * 1000)
  const offsets = (new Array(contours.length)).fill(0).map(_ => ({ x: randomFloat(-contourTranslationalOffsetMaxDistance, contourTranslationalOffsetMaxDistance), y: randomFloat(-contourTranslationalOffsetMaxDistance, contourTranslationalOffsetMaxDistance) }))
  const angleOffsets = (new Array(contours.length)).fill(0).map(_ => ({ angle: randomFloat(2 * PI * -contourRotationalOffsetMax / 360, 2 * PI * contourRotationalOffsetMax / 360), x: randomFloat(-CONTOUR_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE, CONTOUR_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE) + DRAWING_WIDTH_RATIO / 2, y: randomFloat(-CONTOUR_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE, CONTOUR_ROTATIONAL_OFFSET_CENTER_MAX_DISTANCE) + DRAWING_HEIGHT_RATIO / 2 }));
  shapes = (new Array(contours.length)).fill(0).map(_ => []);

  // rotation around center of canvas
  const getChladni = (xOrig, yOrig) => {
    const xAngleCenter = DRAWING_WIDTH_RATIO / 2;
    const yAngleCenter = DRAWING_HEIGHT_RATIO / 2;
    const theta = atan2((xOrig - xAngleCenter), (yOrig - yAngleCenter));
    const distance = Math.sqrt((xOrig - xAngleCenter)**2 + (yOrig - yAngleCenter)**2);

    let x = xAngleCenter + sin(theta + (2 * Math.PI * rotation / 360)) * distance;
    let y = yAngleCenter + cos(theta + (2 * Math.PI * rotation / 360)) * distance;
    if (coordinateSystemIndex === 0) { // CARTESIAN
      x = (x - (tileXOffset * tileZoomRatio + DRAWING_WIDTH_RATIO / 2)) / (0.5 * tileZoomRatio);
      y = (y - (tileYOffset * tileZoomRatio + DRAWING_HEIGHT_RATIO / 2)) / (0.5 * tileZoomRatio);
    } else {
      const xPolarCenter = tileXOffset * tileZoomRatio + DRAWING_WIDTH_RATIO / 2;
      const yPolarCenter = tileYOffset * tileZoomRatio + DRAWING_HEIGHT_RATIO / 2;
      const polarTheta = atan2((x - xPolarCenter), (y - yPolarCenter));
      const polarDistance = Math.sqrt((x - xPolarCenter)**2 + (y - yPolarCenter)**2);

      x = polarDistance / (0.5 * tileZoomRatio);
      y = ((polarTheta - Math.PI) / (Math.PI * (coordinateSystemIndex === 2 ? 0.75 : 1)));
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
            randomGaussian(color[3] ?? 0.8, DOT_ALPHA_SD),
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

/// p5.js methods
setup = () => {
  // initialiseVariables(); // PLAYGROUND

  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  colorMode(HSL);
  noStroke();
  background(...PAPERS[0]); // background(...palette.paper); // PLAYGROUND

  offscreenCanvas = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
  offscreenCanvas.colorMode(HSL);
  offscreenCanvas.noStroke();
  offscreenCanvas.blendMode(MULTIPLY);

  canvas.parent('sketch-canvas');

  // initialiseData(); // PLAYGROUND
}

draw = () => {
  if (frameCount === 1) { // PLAYGROUND
    noLoop();
    fill(...COLORS[0], 0.8);
    textFont('Courier')
    textSize(14);
    textAlign(CENTER);
    text('Click generate output to begin', CANVAS_WIDTH / 2 , CANVAS_HEIGHT / 2);
    return
  }

  drawImage(this, offscreenCanvas, CANVAS_WIDTH, CANVAS_HEIGHT, frameCount - frameCountOffset);

  if (((frameCount - 1) - frameCountOffset) === Object.keys(layers).length) { // PLAYGROUND -1
    noLoop();

    // // TODO remove for release
    // if (downloadIndexParam != null) {
    //   save(`${getFileName()}-${downloadIndexParam}.png`);
    //   if (downloadIndexParam > 1) {
    //     let url =
    //       `${window.location.protocol}//${window.location.host + window.location.pathname}?downloadIndex=${downloadIndexParam - 1}`;
    //     if (sizeQueryParam > 0) url += `&size=${sizeQueryParam}`;
    //     if (dotDensity > 0) url += `&tiledensity=${dotDensity}`;
    //     setTimeout(() => window.location.href = url, 3000);
    //   }
    // }

    // PLAYGROUND
    document.getElementById('traitButton').textContent = 'Generate output';
    document.getElementById('traitButton').disabled = false;
  }
}

function drawImage(canvas, offscreenCanvas, canvasWidth, canvasHeight, frameCountToDraw) {
  canvas.background(...palette.paper);

  if (frameCountToDraw === 1) return; // PLAYGROUND

  const framesToDraw = (frameCountToDraw == null) ? Object.values(layers) : [layers[Object.keys(layers)[frameCountToDraw - 2]]] // -1 -> -2 PLAYGROUND

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
    canvas.fill(...palette.paper);
    canvas.rect(0, 0, canvasWidth, BORDER_WIDTH_RATIO * canvasWidth);
    canvas.rect(0, 0, BORDER_WIDTH_RATIO * canvasWidth, canvasHeight);
    canvas.rect(canvasWidth, canvasHeight, -canvasWidth, -BORDER_WIDTH_RATIO * canvasWidth);
    canvas.rect(canvasWidth, canvasHeight, -BORDER_WIDTH_RATIO * canvasWidth, -canvasHeight);
  }
}

// keyPressed = () => {
//   const lKeyCode = 76;
//   const rKeyCode = 82;
//   const sKeyCode = 83;
//   if (![lKeyCode, rKeyCode, sKeyCode].includes(keyCode)) return;

//   const downloadWidth = DONWLOAD_PRINT_DIMENSION / CANVAS_HEIGHT_RATIO;
//   const downloadHeight = DONWLOAD_PRINT_DIMENSION;
//   if (keyCode === sKeyCode) {
//     console.log(`Saving print...`);

//     const downloadContext = createGraphics(downloadWidth, downloadHeight);
//     downloadContext.colorMode(HSL);
//     downloadContext.pixelDensity(1);
//     downloadContext.noStroke();
//     downloadContext.background(...palette.paper);

//     const downloadOffscreenContext = createGraphics(downloadWidth, downloadHeight);
//     downloadOffscreenContext.colorMode(HSL);
//     downloadOffscreenContext.pixelDensity(1);
//     downloadOffscreenContext.noStroke();

//     drawImage(downloadContext, downloadOffscreenContext, downloadWidth, downloadHeight);

//     downloadContext.save(`${getFileName()}.png`);

//     console.log(`Save of print complete.`);
//   } else if (keyCode === lKeyCode) {
//     console.log(`Saving layers...`);
//     const colorKeys = Object.keys(layers);
//     for (let i = 0; i < colorKeys.length; i++) {
//       const colorKey = colorKeys[i];
//       const shapes = layers[colorKey];
//       const layer = createGraphics(downloadWidth, downloadHeight);
//       layer.colorMode(HSL);
//       layer.pixelDensity(1)
//       layer.noStroke();
//       for (const shape of shapes) {
//         layer.fill(0, 0, 0, shape.fill[3]);
//         layer.beginShape();
//         for (const [x, y] of shape.vertexes) layer.vertex(x * downloadWidth, y * downloadWidth);
//         layer.endShape()
//       }
//       const outputLayer = createGraphics(downloadWidth, downloadHeight);
//       outputLayer.colorMode(HSL);
//       outputLayer.pixelDensity(1);
//       outputLayer.image(
//         layer,
//         BORDER_WIDTH_RATIO * downloadWidth,
//         BORDER_WIDTH_RATIO * downloadWidth,
//         downloadWidth - 2 * BORDER_WIDTH_RATIO * downloadWidth,
//         downloadHeight - 2 * BORDER_WIDTH_RATIO * downloadWidth,
//         BORDER_WIDTH_RATIO * downloadWidth,
//         BORDER_WIDTH_RATIO * downloadWidth,
//         downloadWidth - 2 * BORDER_WIDTH_RATIO * downloadWidth,
//         downloadHeight - 2 * BORDER_WIDTH_RATIO * downloadWidth,
//       );
//       outputLayer.save(`${getFileName()}-${i}_${colorKey}.png`);
//     }
//     console.log(`Saving of layers complete.`);
//   // TODO remove for release
//   } else if (keyCode === rKeyCode) {
//     let url =
//       `${window.location.protocol}//${window.location.host + window.location.pathname}`;
//     if (sizeQueryParam > 0 || dotDensity > 0)
//       url += `?${[(sizeQueryParam > 0 ? `size=${sizeQueryParam}` : undefined),(dotDensity > 0 ? `tiledensity=${dotDensity}` : undefined)].filter(Boolean).join('&')}`;
//     window.location.href = url
//   }
// }

/// utils:

// dimensions
const CANVAS_WIDTH_RATIO = 1;
const CANVAS_HEIGHT_RATIO = Math.sqrt(2);

const DRAWING_WIDTH_RATIO = 1;
const DRAWING_HEIGHT_RATIO = (CANVAS_HEIGHT_RATIO - 2 * BORDER_WIDTH_RATIO) / (CANVAS_WIDTH_RATIO - 2 * BORDER_WIDTH_RATIO);

const CANVAS_DIMENSION = 0.75 * (!!sizeQueryParam // PLAYGROUND 0.75
  ? sizeQueryParam
  : Math.min(window.innerWidth, window.innerHeight / CANVAS_HEIGHT_RATIO));
const CANVAS_HEIGHT = Math.round(CANVAS_DIMENSION * CANVAS_HEIGHT_RATIO);
const CANVAS_WIDTH = Math.round(CANVAS_DIMENSION * CANVAS_WIDTH_RATIO);

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
  return listWithCumulatives.findIndex(o => rand < o.cumulativeProbability);
}

// misc
function toClosestTenth(input) {
  return Math.round(10 * input) / 10;
}

// TODO change this for release
const getFileName = () => `interference-${TOKEN_SEED}`

/// features
const PAPER_NAMES = [
  'Natural', // 0
  'Azure', // 1
  'Candy', // 2
  'Pistachio', // 3
  'Citrine', // 4
  'Adriatic', // 5
  'Amethyst', // 6
];

const INK_NAMES = [
  'Black', // 0
  'Light Mauve', // 1
  'Violet', // 2
  'Light Grey', // 3
  'Orange', // 4
  'Bright Red', // 5
  'Fluo Pink', // 6
  'Light Teal', // 7
  'Sunflower', // 8
  'Mint', // 9
  'Medium Blue', // 10
  'Bubblegum', // 11
  'Purple', // 12
  'Blue', // 13
  'Aqua', // 14
  'Coral', // 15
  'Copper', // 16
  'Teal', // 17
  'Bisque', // 18
  'Moss', // 19
  'Metallic Gold', // 20
  'Cranberry', // 21
  'Federal Blue', // 22
];

const PALETTE_NAMES = [
  'Breaking News', // 0
  'Spectrum', // 1
  'Bubblegum Sun', // 2
  'Tokyo Nights', // 3
  'Coral', // 4
  'Kingfisher', // 5
  'Ficus', // 6
  'Rust', // 7
  'Roller Disco', // 8
  'Hyacinth', // 9
  'Watermelon', // 10
  'Flamingo', // 11
  'Black', // 12
  'Blue', // 13
  'Sunflower', // 14
  'Natural Greyscale', // 15
  'Azure Greyscale', // 16
  'Candy Greyscale', // 17
  'Pistachio Greyscale', // 18
  'Citrine Greyscale', // 19
  'Adriatic Greyscale', // 20
  'Ocean', // 21
  'Floss', // 22
  'Vase', // 23
];

const STYLE_NAMES = [
  'Polychromatic', // 0
  'Polychromatic', // 1
  'Polychromatic', // 2
  'Polychromatic', // 3
  'Polychromatic', // 4
  'Polychromatic', // 5
  'Polychromatic', // 6
  'Polychromatic', // 7
  'Polychromatic', // 8
  'Duotone', // 9
  'Duotone', // 10
  'Duotone', // 11
  'Monochromatic', // 12
  'Monochromatic', // 13
  'Monochromatic', // 14
  'Greyscale', // 15
  'Greyscale', // 16
  'Greyscale', // 17
  'Greyscale', // 18
  'Greyscale', // 19
  'Greyscale', // 20
  'Overprinted', // 21
  'Overprinted', // 22
  'Overprinted', // 23
]

function getFeatures() {
  return {
    'Ink': PALETTE_NAMES[paletteIndex],
    'Paper': PAPER_NAMES[palette.paperIndex],
    'Style': STYLE_NAMES[paletteIndex],
    'Colouring': ['Shuffled', 'Grouped', 'Ordered', 'Ordered'][contourColorDistributionIndex],
    'Coordinates': ['Cartesian', 'Polar', 'Polar Distorted'][coordinateSystemIndex],
    'Magnification': ['Low', 'Medium', 'High', 'Very High'][Math.floor(tileZoomRatioIndex / 2)],
    'Contours': ['Low', 'Medium', 'High', 'Very High'][Math.floor(contourCountIndex / 2)],
    'Misregistration': ['None', 'Medium', 'High', 'Very High'][contourMisregistrationIndex],
  }
}

// PLAYGROUND
document.getElementById('traitButton').addEventListener('click', function() {
  document.getElementById('traitButton').disabled = true;
  document.getElementById('traitButton').textContent = 'Calculating...';
  document.getElementById('trait-ink').textContent = '...';
  document.getElementById('trait-colouring').textContent = '...';
  document.getElementById('trait-coordinates').textContent = '...';
  document.getElementById('trait-magnification').textContent = '...';
  document.getElementById('trait-contours').textContent = '...';
  document.getElementById('trait-misregistration').textContent = '...';

  TOKEN_SEED = "0x";
  for (let i = 0; i < 64; i++) {
    TOKEN_SEED += Math.floor(Math.random() * 16).toString(16);
  }

  R = new Random();

  offscreenCanvas = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
  offscreenCanvas.colorMode(HSL);
  offscreenCanvas.noStroke();
  offscreenCanvas.blendMode(MULTIPLY);

  initialiseVariables();

  if (dropdownValues.ink >= 0) {
    paletteIndex = dropdownValues.ink;
    palette = PALETTES[paletteIndex];
    isMonochrome = palette.colors.length === 1;
  }

  if (dropdownValues.colouring >= 0) {
    if (dropdownValues.colouring === 2) {
      contourColorDistributionIndex = randomUnit() < 0.5 ? 2 : 3
    } else {
      contourColorDistributionIndex = dropdownValues.colouring
    }
  }

  if (dropdownValues.coordinates >= 0) {
    coordinateSystemIndex = dropdownValues.coordinates
  }

  if (dropdownValues.magnification >= 0) {
    tileZoomRatioIndex = dropdownValues.magnification * 2
    if (dropdownValues.magnification <= 2 && randomUnit() < 0.5) tileZoomRatioIndex += 1;
    tileZoomRatio = TILE_ZOOM_RATIOS[tileZoomRatioIndex]; // the zoom of the Chladni tiles
  }

  if (dropdownValues.contours >= 0) {
    contourCountIndex = dropdownValues.contours * 2 + (randomUnit() < 0.5 ? 1 : 0);
    contourCount = CONTOUR_COUNTS[contourCountIndex] + ((isMonochrome && randomUnit() < 0.5) ? 1 : 0);
  }

  if (dropdownValues.misregistration >= 0) {
    contourMisregistrationIndex = dropdownValues.misregistration;
    contourRotationalOffsetMax = contourMisregistrationIndex;
    contourTranslationalOffsetMaxDistance = 0.01 * contourMisregistrationIndex;
  }

  background(...PAPERS[palette.paperIndex]);

  const features = getFeatures();
  document.getElementById('trait-ink').textContent = features.Ink;
  document.getElementById('trait-colouring').textContent = features.Colouring;
  document.getElementById('trait-coordinates').textContent = features.Coordinates;
  document.getElementById('trait-magnification').textContent = features.Magnification;
  document.getElementById('trait-contours').textContent = features.Contours;
  document.getElementById('trait-misregistration').textContent = features.Misregistration;

  setTimeout(() => {
    initialiseData();
  
    frameCountOffset = frameCount;

    document.getElementById('traitButton').textContent = 'Rendering...';
    setTimeout(() => {
      loop();
    }, 250);
  }, 250);
});