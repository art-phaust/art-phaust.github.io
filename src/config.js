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

function randomInt(min, max) { // from min (inclusive) to max (inclusive)
  return min + Math.floor(fxrand() * ((max - min) + 1));
}

const CANVAS_WIDTH_RATIO = 1.778;
export const DIMENSION = Math.min(window.innerWidth, window.innerHeight); // 450; // do not export
export const CANVAS_HEIGHT = DIMENSION;
const CANVAS_HEIGHT_RATIO = 0.9;
export const CANVAS_WIDTH = CANVAS_WIDTH_RATIO * DIMENSION; // do not export

export const STRIP_VERTEX_COUNT = 200;

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

export const getUserConfig = () => {
  const USER_CONFIG = {
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
  };

  return USER_CONFIG;
};

export function createConfig(config) {
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