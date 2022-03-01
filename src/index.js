import p5 from 'p5';

function createConfig(config) {
  if (typeof config !== 'object') return config;
  if (Array.isArray(config)) return config.map(el => createConfig(el));
  return Object.keys(config).reduce(
    (acc, key) => {
      const valueType = typeof config[key];
      const rawValue = config[key];
      switch (valueType) {
        case 'object':
          acc[key] = createConfig(rawValue);
          break;
        case 'function':
          acc[`${key.charAt(3).toLowerCase()}${key.slice(4)}`] = rawValue();
          break;
        default:
          acc[key] = rawValue;
      }
      return acc;
    },
    {},
  );
}

function chooseByProbability(list) {
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

const REPEAT_COUNT = parseInt(new URLSearchParams(window.location.search).get('repeat') ?? '1', 10);
let repeatIndex = 0;

const DO_ANIMATE = new URLSearchParams(window.location.search).get('animate') === 'true' && REPEAT_COUNT === 1;
let frameIndex = 0;

const CANVAS_WIDTH_RATIO = 1.778;
const DIMENSION = Math.min(window.innerWidth, window.innerHeight); // TODO lower this for collection generation when testing
const CANVAS_HEIGHT = DIMENSION;
const CANVAS_HEIGHT_RATIO = 0.9;
const CANVAS_WIDTH = CANVAS_WIDTH_RATIO * DIMENSION;

const STRIP_VERTEX_COUNT = 200;

const PALLETES = [
  { // Jamison
    bgColor: [218, 80, 98],
    colors: [
      { fg: [213, 72, 62], hues: [0.9, 0.8] },
      { fg: [222, 99, 54], hues: [0.9, 0.8] },
      { fg: [279, 30, 55], hues: [0.8, 0.5] },
      { fg: [296, 70, 66], hues: [0.8, 0.6] },
    ],
    hasMono: true,
    probability: 0.22,
  },
  { // Rocky
    bgColor: [216, 20, 97],
    colors: [
      { fg: [20, 63, 55], hues: [0.9, 0.4] },
      { fg: [219, 30, 55], hues: [0.8, 0.6] },
      { fg: [253, 28, 55], hues: [0.8, 0.6] },
      { fg: [346, 80, 47], hues: [0.8, 0.6] },
    ],
    hasMono: true,
    probability: 0.22,
  },
  { // Ural
    bgColor: [30, 50, 97],
    colors: [
      { fg: [32, 99, 68], hues: [0.9, 0.8] },
      { fg: [118, 66, 26], hues: [0.8, 0.2] },
      { fg: [213, 55, 45], hues: [0.9, 0.8] },
      { fg: [215, 19, 41], hues: [0.8, 0.6] },
    ],
    hasMono: true,
    probability: 0.22,
  },
  { // Vinicunca
    bgColor: [4, 70, 98],
    colors: [
      { fg: [3, 99, 68], hues: [0.9, 0.6] },
      { fg: [185, 48, 45], hues: [0.9, 0.8] },
      { fg: [348, 100, 82], hues: [0.9, 0.6] },
      { fg: [350, 40, 50], hues: [0.8, 0.6] },
    ],
    probability: 0.22,
  },

  { // Arctic
    bgColor: [203, 56, 8],
    colors: [
      { fg: [172, 90, 55] },
      { fg: [186, 92, 40] },
      { fg: [236, 100, 65] },
      { fg: [293, 55, 68] },
    ],
    hasMono: false,
    probability: 0.08,
  },

  { // Duotones
    colors: [
      { fg: [32, 99, 68], bg: [346, 80, 47] },
      { fg: [236, 100, 65], bg: [32, 99, 68] },
      { fg: [172, 90, 55], bg: [236, 100, 65] },
      { fg: [346, 80, 47], bg: [172, 90, 55] },
    ],
    hasMono: false,
    probability: 0.04,
  },
];

let USER_CONFIG;
const getUserConfig = () => ({
  canvas: {
    width: 1,
  },

  drawing: {
    heightRatio: CANVAS_HEIGHT_RATIO,
    widthRatio: CANVAS_WIDTH_RATIO + CANVAS_HEIGHT_RATIO - 1,
    getColors: () => {
      const pallete = chooseByProbability(PALLETES);

      const monoProbability = 0.08; // given a pallete, this is the chance of mono
      const hue1Probaility = 0.25; // given a pallete and that it's not mono, this is the chance of hue1
      const hue2Probaility = 0.25; // given a pallete and that it's not mono, this is the chance of hue2

      const isMono = pallete.hasMono && fxrand() < monoProbability;
      if (isMono) {
        return {
          fg: [0, 0, 0],
          bg: pallete.bgColor,
        };
      }
      const color = pallete.colors[Math.floor(fxrand() * pallete.colors.length)];
      const hueRand = fxrand();
      const hueMinRatio = color.hues != null
        ? hueRand < hue1Probaility
          ? color.hues[0]
          : hueRand < (hue1Probaility + hue2Probaility)
            ? color.hues[1]
            : 1
        : 1;
      return {
        fg: color.fg,
        bg: color.bg ?? pallete.bgColor,
        hueMinRatio,
      };
    },
  },

  layers: {
    layers: [
      {
        isBackground: true,
        strips: {
          yLength: 0.7,
        },
        yIncrementalOffset: 0,
      },
      {
        isBackground: true,
        isHidden: fxrand() < 0.5,
        isInverted: true,
        strips: {
          yLength: 0.7,
        },
        yIncrementalOffset:0,
        xOffset: 0.01 / CANVAS_WIDTH_RATIO,
      },

      // Base Layer
      {
        strips: {
          getYLength: () => USER_CONFIG.layers.yLengthBase,
        },
        getYOffset: () => USER_CONFIG.layers.yOffsetBase,
      },
      {
        strips: {
          getYLength: () => USER_CONFIG.layers.yLengthBase,
        },
        getYOffset: () => USER_CONFIG.layers.yOffsetBase,
      },

      // Partial A
      {
        strips: {
          getYLength: () => USER_CONFIG.layers.yLengthBase * 0.5,
        },
        getYOffset: () => USER_CONFIG.layers.yOffsetBase + 0.05,
        xStart: randomInt(1, 6) * 0.2,
      },
      {
        strips: {
          getYLength: () => USER_CONFIG.layers.yLengthBase * 0.5,
        },
        getYOffset: () => USER_CONFIG.layers.yOffsetBase + 0.05,
        xStart: randomInt(1, 6) * 0.2,
        getIsHidden: () => USER_CONFIG.layers.hasDoublePartial,
      },

      // Partial B
      {
        strips: {
          getYLength: () => USER_CONFIG.layers.yLengthBase * 0.5,
        },
        getYOffset: () => USER_CONFIG.layers.yOffsetBase + 0.05,
        xEnd: randomInt(1, 4) * 0.3,
      },
      {
        strips: {
          getYLength: () => USER_CONFIG.layers.yLengthBase * 0.5,
        },
        getYOffset: () => USER_CONFIG.layers.yOffsetBase + 0.05,
        xEnd: randomInt(1, 4) * 0.3,
        getIsHidden: () => USER_CONFIG.layers.hasDoublePartial,
      },
    ],

    // custom fields used for w100
    hasDoublePartial: fxrand() < 0.75,
    yLengthBase: randomInt(1, 3) * 0.2, 
    yOffsetBase: randomInt(2, 5) * 0.1,

    defaults: {
      drawWeight: 0.001 * DIMENSION,
      isBackground: false,
      isHidden: false,
      isInverted: false,
      strips: {
        vertexCount: STRIP_VERTEX_COUNT,
        xDensity: randomInt(2, 5) * 0.2 * CANVAS_WIDTH_RATIO,
        xDistortionRange: randomInt(1, 5) * 0.3 * CANVAS_WIDTH_RATIO,
        yLength: 1,
        yLengthRange: 0.3,
      },
      xOffset: 0,
      xTaperLength: 0.33 / CANVAS_WIDTH_RATIO,
      xStart: 0,
      xEnd: 1,
      getYIncrementalOffset: () => (5 + (randomInt(1, 3) * 3)) * 0.001 * USER_CONFIG.layers.yLengthBase,
      yOffset: 0,
    },
  },

  getBreaks: () => {	
    const breakTypes = [	
      { // diptych	
        probability: 0.10,	
        breaks: {	
          horizontal: [],	
          vertical: [	
            { at: 0.5, size: 0.025 },	
          ]	
        },	
      },	
      { // triptych	
        probability: 0.12,	
        breaks: {	
          horizontal: [],	
          vertical: [	
            { at: 0.3333, size: 0.025 },	
            { at: 0.6666, size: 0.025 },	
          ]	
        },	
      },	
      { // singleVerticalOne	
        probability: 0.08,	
        breaks: {	
          horizontal: [],	
          vertical: [	
            { at: 0.3333, size: 0.025 },	
          ]	
        },	
      },	
      { // singleVerticalTwo	
        probability: 0.08,	
        breaks: {	
          horizontal: [],	
          vertical: [	
            { at: 0.6666, size: 0.025 },	
          ]	
        },	
      },	
      { // singleHorizontal	
        probability: 0.08,	
        breaks: {	
          horizontal: [	
            { at: 0.6666, size: 0.025 * CANVAS_WIDTH_RATIO },	
          ],	
          vertical: [],	
        },	
      },	
      { // default	
        // do not specify probability for the default case	
        breaks: {	
          horizontal: [],	
          vertical: [],	
        }	
      }	
    ];	
    return chooseByProbability(breakTypes).breaks;	
  },

  rain: {
    isOn: fxrand() < 0.2,
    alphaRatio: 1,
    angle: fxrand() < 0.5
      ? randomInt(1, 3) * 20
      : randomInt(1, 4) * -15,
    gap: 10,
    length: {
      min: 5,
      max: 10,
    },
    yCutoff: 0.4,
    yCutoffRange: 0.1,
    weight: {
      min: 0.2,
      max: 0.6,
    },
  },

  sun: {
    isOn: fxrand() < 0.3,	
    minRadius: 0.08 / CANVAS_WIDTH_RATIO,	
    maxRadius: 0.20 / CANVAS_WIDTH_RATIO,
    halo: {
      count: (randomInt(0, 3) * 2) - 1,
      gap: 0.2,
      width: 0.05,
    },
  },

  snow: {
    isOn: fxrand() < 0.1,
    color: [0, 0, 100],
    yIncrementalOffset: 0,
    drawWeight: {
      min: 1,
      max: 2,
    },
    strips: {
      vertexCount: 40,
      yLength: 0.25,
    },
  },
});

let CANVAS;
let CONFIG;
let STRIPS_FOR_LAYERS;
let RAINDROPS;

function randomInt(min, max) { // from min (inclusive) to max (inclusive)
  return min + Math.floor(fxrand() * ((max - min) + 1));
}

function randomFloat(min, max) { // from min (inclusive) to max (exclusive)
  return min + (fxrand() * ((max - min)));
}

function isInsideBounds(x, y) {
  return (
    y >= CONFIG.derived.drawing.topLeftY && y <= CONFIG.derived.drawing.bottomRightY
  ) && (
    !CONFIG.user.breaks.horizontal.find(({ at, size }) =>
      y >= CONFIG.derived.drawing.topLeftY + CONFIG.derived.drawing.height * (at - size / 2) &&
      y <= CONFIG.derived.drawing.topLeftY + CONFIG.derived.drawing.height * (at + size / 2)
    )
  ) && (
    !CONFIG.user.breaks.vertical.find(({ at, size }) =>
      x >= CONFIG.derived.drawing.topLeftX + CONFIG.derived.drawing.width * (at - size / 2) &&
      x <= CONFIG.derived.drawing.topLeftX + CONFIG.derived.drawing.width * (at + size / 2)
    )
  );
}

function getLayers() {
  return CONFIG.user.layers.layers
    .filter(l => !(l.isHidden ?? CONFIG.user.layers.defaults.isHidden))
    .concat(CONFIG.user.snow.isOn ? [{ ...CONFIG.user.snow, isSnow: true }] : []);
}

function getIsInSun(x, y, isBackground) {
  // const distanceFromSunCenter = p5.dist(x, y, CONFIG.derived.drawing.topLeftX + CONFIG.derived.sun.center.x, CONFIG.derived.drawing.topLeftY + CONFIG.derived.sun.center.y);
  const distanceFromSunCenter = Math.sqrt((x - CONFIG.derived.drawing.topLeftX + CONFIG.derived.sun.center.x)**2 + (y - CONFIG.derived.drawing.topLeftY + CONFIG.derived.sun.center.y)**2);
  if (!(CONFIG.user.sun.isOn && isBackground)) return false;
  if (distanceFromSunCenter <= CONFIG.derived.sun.radius) return true;
  for (let i = 1; i <= CONFIG.user.sun.halo.count; i++) {
    if (
      distanceFromSunCenter >= CONFIG.derived.sun.radius * ((1 + i * CONFIG.user.sun.halo.gap) - CONFIG.user.sun.halo.width / 2) &&
      distanceFromSunCenter <= CONFIG.derived.sun.radius * ((1 + i * CONFIG.user.sun.halo.gap) + CONFIG.user.sun.halo.width / 2)
    ) return true;
  }
  return false;
}

function getIsTapered(i, j, stripsCount, stripVertexCount, xStart, xEnd, xTaperLength) {
  const xProgress = i / stripsCount;
  return (
    (
      xStart > 0 &&
      (
        xProgress < xStart ||
        (
          xProgress >= xStart &&
          (xProgress - xStart) / (xEnd - xStart) < xTaperLength &&
          ((stripVertexCount - j) / stripVertexCount) > ((xProgress - xStart) / (xEnd - xStart)) / xTaperLength
        )
      )
    ) || (
      xEnd < 1 &&
      (
        xProgress > xEnd ||
        (
          xProgress <= xEnd &&
          (xEnd - xProgress) / (xEnd - xStart) < xTaperLength &&
          ((stripVertexCount - j) / stripVertexCount) > ((xEnd - xProgress) / (xEnd - xStart)) / xTaperLength
        )
      )
    )
  );
}

function drawLayers() {
  const layers = getLayers();

  const { fg: fgColor, hueMinRatio } = CONFIG.user.drawing.colors;

  for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
    const layer = layers[layerIndex];

    const stripsForLayer = [];

    const drawWeight = layer.drawWeight ?? CONFIG.user.layers.defaults.drawWeight;
    const isBackground = layer.isBackground ?? CONFIG.user.layers.defaults.isBackground;
    const isInverted = layer.isInverted ?? CONFIG.user.layers.defaults.isInverted;
    const isSnow = !!layer.isSnow;
    const stripXDensity = layer.strips.xDensity ?? CONFIG.user.layers.defaults.strips.xDensity;
    const stripXDistortionRange = layer.strips.xDistortionRange ?? CONFIG.user.layers.defaults.strips.xDistortionRange;
    const stripYLength = layer.strips.yLength ?? CONFIG.user.layers.defaults.strips.yLength;
    const stripYLengthRange = layer.strips.yLengthRange ?? CONFIG.user.layers.defaults.strips.yLengthRange;
    const stripVertexCount = layer.strips.vertexCount ?? CONFIG.user.layers.defaults.strips.vertexCount;
    const xTaperLength = layer.xTaperLength ?? CONFIG.user.layers.defaults.xTaperLength;
    const xOffset = layer.xOffset ?? CONFIG.user.layers.defaults.xOffset;
    const xStart = layer.xStart ?? CONFIG.user.layers.defaults.xStart;
    const xEnd = layer.xEnd ?? CONFIG.user.layers.defaults.xEnd;
    const yIncrementalOffset = layer.yIncrementalOffset ?? CONFIG.user.layers.defaults.yIncrementalOffset;
    const yOffset = layer.yOffset ?? CONFIG.user.layers.defaults.yOffset;

    const stripCount = Math.round(stripXDensity * CONFIG.derived.drawing.width);
    const stripWidth = CONFIG.derived.drawing.width / stripCount;
    const stripXDistortion = stripXDistortionRange * stripWidth;

    const initialYOffset = yOffset;

    // this a hacky fix to a broken animation caused by a hacky solution to hide a layer
    // but we didn't want to change anything major at this late stage
    if (xStart >= 1) continue;

    let stripX = CONFIG.derived.drawing.topLeftX + (xOffset * CONFIG.derived.drawing.width);
    let stripY = isInverted
      ? (CANVAS_HEIGHT - CONFIG.derived.drawing.topLeftY) - (initialYOffset * CANVAS_HEIGHT)
      : CONFIG.derived.drawing.topLeftY + (initialYOffset * CANVAS_HEIGHT);
    const strips = [];
    [...Array(stripCount + 1)].forEach(() => {
      const newStripY = stripY + randomFloat(-yIncrementalOffset, yIncrementalOffset) * CANVAS_HEIGHT;
      if (newStripY < CONFIG.derived.drawing.topLeftY) {
        stripY += randomFloat(0, yIncrementalOffset) * CANVAS_HEIGHT;
      } else if (newStripY > CONFIG.derived.drawing.topLeftY + CONFIG.derived.drawing.height) {
        stripY += randomFloat(-yIncrementalOffset, 0) * CANVAS_HEIGHT;
      } else {
        stripY = newStripY;
      }
      strips.push(generateStrip(
        stripX, stripY,
        stripVertexCount, stripXDistortion, stripYLength, stripYLengthRange,
        isInverted,
      ));
      stripX += stripWidth;
    });
  
    const fadedHue =
      Math.round(((fgColor[0] - (((layers.length - 1) - layerIndex) * (1 - (hueMinRatio ?? 1)) * 360 / layers.length - 1)) + 360) % 360);
    // const colorObject = !isSnow
    //   ? p5.color(`hsl(${fadedHue}, ${fgColor[1]}%, ${fgColor[2]}%)`)
    //   : p5.color('hsl(0, 0%, 100%)');
    const hue = !isSnow ? fadedHue : 0;
    const saturation = !isSnow ? fgColor[1] : 0;
    const lightness = !isSnow ? fgColor[2] : 100;

    for (let i = 0; i < strips.length; i++) {
      const verticesForStrip = [];
      let prevIsInSun = getIsInSun(strips[i][0].x, strips[i][0].y, isBackground);
      // let fillColor = [p5.hue(colorObject), p5.saturation(colorObject), p5.lightness(colorObject), prevIsInSun ? 0 : p5.alpha(colorObject)];
      let fillColor = [hue, saturation, lightness, prevIsInSun ? 0 : 1];
      for (let j = 0; j < stripVertexCount; j++) {
        const { x, y, doNotPlot } = strips[i][j];
        const isInSun = getIsInSun(x, y, isBackground);
        if (!prevIsInSun && isInSun) {
          // fillColor = [p5.hue(colorObject), p5.saturation(colorObject), p5.lightness(colorObject), 0];
          fillColor = [hue, saturation, lightness, 0];
        } else if (prevIsInSun && !isInSun) {
          // fillColor = [p5.hue(colorObject), p5.saturation(colorObject), p5.lightness(colorObject)];
          fillColor = [hue, saturation, lightness];
        }
        prevIsInSun = isInSun;

        const shapeDimension = drawWeight * (!isSnow
          ? 1
          : randomInt(CONFIG.user.snow.drawWeight.min, CONFIG.user.snow.drawWeight.max)
        );
        verticesForStrip.push({
          x, y,
          color: fillColor,
          weight: !(doNotPlot || getIsTapered(i, j, strips.length, stripVertexCount, xStart, xEnd, xTaperLength))
            ? shapeDimension
            : 0,
        });
      }
      stripsForLayer.push(verticesForStrip);
    }
    STRIPS_FOR_LAYERS.push(stripsForLayer);
  }

  if (CONFIG.user.rain.isOn) {
    for (const mode of ['y', 'x']) {
      let rainStartingX = CONFIG.derived.drawing.topLeftX + (CONFIG.user.rain.angle >= 0 ? 0 : CONFIG.derived.drawing.width);
      let rainStartingY = mode === 'y'
        ? CONFIG.derived.drawing.topLeftY + CONFIG.user.rain.yCutoff * CANVAS_HEIGHT
        : CONFIG.derived.drawing.topLeftY;
      while (true) {
        let stripX = rainStartingX;
        let stripY = rainStartingY;
        let lastWasRain = true;
        const rainStripYCutoff = CONFIG.user.rain.yCutoff * (1 + randomFloat(-CONFIG.user.rain.yCutoffRange, CONFIG.user.rain.yCutoffRange));
        while (true) {
          const weight = randomFloat(CONFIG.user.rain.weight.min, CONFIG.user.rain.weight.max);
          const length = weight * randomFloat(CONFIG.user.rain.length.min, CONFIG.user.rain.length.max);
          stripY += randomFloat(-length, length) * Math.cos(CONFIG.user.rain.angle * (180 / Math.PI));
          const endStripX = stripX + length * Math.sin(CONFIG.user.rain.angle * (180 / Math.PI));
          const endStripY = stripY + length * Math.cos(CONFIG.user.rain.angle * (180 / Math.PI));
          if (endStripX > CONFIG.derived.drawing.bottomRightX) break;
          if (endStripY > CONFIG.derived.drawing.bottomRightY) break;
    
          if (!lastWasRain) {
            RAINDROPS.push({ xStart: stripX, yStart: stripY, xEnd: endStripX, yEnd: endStripY, weight });
          }
          stripX = endStripX;
          stripY = endStripY;
          
          if (stripY > CONFIG.derived.drawing.topLeftY + rainStripYCutoff * CANVAS_HEIGHT) break;
          lastWasRain = !lastWasRain;
        }
        if (mode === 'y') {
          rainStartingY -= CONFIG.user.rain.gap * Math.sin((90 - CONFIG.user.rain.angle) * (180 / Math.PI));
          if (rainStartingY < CONFIG.derived.drawing.topLeftY) break;
        } else {
          rainStartingX += CONFIG.user.rain.gap * Math.cos((90 - CONFIG.user.rain.angle) * (180 / Math.PI));
          if (CONFIG.user.rain.angle >= 0) {
            if (rainStartingX > CONFIG.derived.drawing.bottomRightX) break;
          } else {
            if (rainStartingX < CONFIG.derived.drawing.topLeftX) break;
          }
        }
      }
    }
  }
}

function generateStrip(
  stripX, stripY,
  stripVertexCount, stripXDistortion, stripYLength, stripYLengthRange,
  isInverted = false,
) {
  const strip = [];

  const stripLength = stripYLength * (1 + randomFloat(-stripYLengthRange, stripYLengthRange)) * CANVAS_HEIGHT;

  for (let i = 0; i < stripVertexCount; i++) {
    const x = stripX + randomFloat(-stripXDistortion, stripXDistortion);
    const y = stripY + (stripLength / stripVertexCount) * (isInverted ? -i : i);

    strip.push({ x, y, doNotPlot: !isInsideBounds(x, y) });
  }

  return strip;
}

const sketch = (p5) => {
  p5.setup = () => {
    CANVAS = p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p5.colorMode(p5.HSL);
  }

  let animationLayerIndex = 0;
  let animationVertexIndex = 0;
  p5.draw = () => {
    if (!(DO_ANIMATE && frameIndex > 0)) {
      USER_CONFIG = getUserConfig();
      const REPEAT_CONFIG = {
        user: createConfig(USER_CONFIG),
        derived: {},
      };

      const BORDER_Y_RATIO = (1 - REPEAT_CONFIG.user.drawing.heightRatio) / 2;
      const DRAWING_HEIGHT = REPEAT_CONFIG.user.drawing.heightRatio * CANVAS_HEIGHT;
      const DRAWING_WIDTH = REPEAT_CONFIG.user.drawing.widthRatio * DIMENSION;

      REPEAT_CONFIG.derived.drawing = {
        height: DRAWING_HEIGHT,
        width: REPEAT_CONFIG.user.drawing.widthRatio * DIMENSION,

        topLeftX: (CANVAS_WIDTH - DRAWING_WIDTH) / 2,
        bottomRightX: CANVAS_WIDTH - (CANVAS_WIDTH - DRAWING_WIDTH) / 2,
        topLeftY: CANVAS_HEIGHT * BORDER_Y_RATIO,
        bottomRightY: CANVAS_HEIGHT * (1 - BORDER_Y_RATIO),
      };

      const NON_BACKGROUND_MIN_OFFSET = Math.min(...REPEAT_CONFIG.user.layers.layers
        .filter(l => !(l.isBackground ?? REPEAT_CONFIG.user.layers.defaults.isBackground))
        .map(l => l.yOffset ?? REPEAT_CONFIG.user.layers.defaults.yOffset)
      );
      REPEAT_CONFIG.derived.sun = {
        radius: DRAWING_WIDTH * (REPEAT_CONFIG.user.sun.minRadius + fxrand() * (REPEAT_CONFIG.user.sun.maxRadius - REPEAT_CONFIG.user.sun.minRadius)),
        center: {
          x: fxrand() * DRAWING_WIDTH,
          y: fxrand() * NON_BACKGROUND_MIN_OFFSET * DRAWING_HEIGHT,
        },
      };

      CONFIG = REPEAT_CONFIG;

      p5.background(...CONFIG.user.drawing.colors.bg);

      STRIPS_FOR_LAYERS = [];
      RAINDROPS = [];
      drawLayers();

      if (REPEAT_COUNT > 1) {
        console.log(`Repeat: ${repeatIndex}`);
      }
      console.log(JSON.stringify(REPEAT_CONFIG, null, 2));
      console.log();
      console.log(`hash: ${fxhash}`);
      console.log('---');
    }

    p5.noStroke();
    if (DO_ANIMATE) {
      const animationRate = animationLayerIndex + 1;
      const stripsForLayer = STRIPS_FOR_LAYERS[animationLayerIndex];
      if (animationLayerIndex < STRIPS_FOR_LAYERS.length) {
        for (const stripForLayer of stripsForLayer) {
          for (let i = 0; i < animationRate; i++) {
            const vertex = stripForLayer[animationVertexIndex + i];
            if (vertex != null) {
              const { x, y, color, weight } = vertex;
              p5.fill(...color);
              p5.ellipse(x, y, weight);
            }
          }
        }
        if (animationVertexIndex + 1 >= STRIP_VERTEX_COUNT) {
          animationLayerIndex++;
          animationVertexIndex = 0;
        } else {
          animationVertexIndex += animationRate;
        }
      } else {
        if (animationLayerIndex === STRIPS_FOR_LAYERS.length) {
          if (CONFIG.user.rain.isOn) {
            const raindrops = RAINDROPS.filter(r => r.yStart >= animationVertexIndex && r.yStart < animationVertexIndex + animationRate);
    
            for (const raindrop of raindrops) {
              const { xStart, yStart, xEnd, yEnd, weight } = raindrop;
              p5.beginShape();
              p5.stroke(...CONFIG.user.drawing.colors.bg);
              p5.strokeWeight(weight);
              p5.vertex(xStart, yStart);
              p5.vertex(xEnd, yEnd);
              p5.endShape();
            }
    
            if (animationVertexIndex > CONFIG.derived.drawing.height) animationLayerIndex++
            else animationVertexIndex += animationRate;
          } else {
            animationLayerIndex++;
          }
        }
        if (animationLayerIndex > STRIPS_FOR_LAYERS.length) p5.noLoop();
      }

      frameIndex++;
    } else {
      for (const stripsForLayer of STRIPS_FOR_LAYERS) {
        for (const stripForLayer of stripsForLayer) {
          for (const vertex of stripForLayer) {
            if (vertex != null) {
              const { x, y, color, weight } = vertex;
              p5.fill(...color);
              p5.ellipse(x, y, weight);
            }
          }
        }
      }
      for (const raindrop of RAINDROPS) {
        const { xStart, yStart, xEnd, yEnd, weight } = raindrop;
        p5.beginShape();
        p5.stroke(...CONFIG.user.drawing.colors.bg);
        p5.strokeWeight(weight);
        p5.vertex(xStart, yStart);
        p5.vertex(xEnd, yEnd);
        p5.endShape();
      }
      const collectionName = new URLSearchParams(window.location.search).get('collectionName');
      if (collectionName) {
        p5.save(
          CANVAS, 
          `${collectionName}${REPEAT_COUNT > 1 ? `_${repeatIndex + 1}` : ''}.png`,
        );
      }
      if (++repeatIndex === REPEAT_COUNT) p5.noLoop(); // TODO fxpreview()
    }
  }
}

new p5(sketch, 'sketch-canvas');
