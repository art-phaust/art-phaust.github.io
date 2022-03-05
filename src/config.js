import { randomInt, chooseByProbability, randomFloat } from './utils';

const PALLETES = [
  {
    name: 'Jamison',
    bgColor: [218, 80, 98],
    colors: [
      { fg: [213, 72, 62], hues: [0.9, 0.8], name: 'Blue' },
      { fg: [222, 99, 54], hues: [0.9, 0.8], name: 'Indigo' },
      { fg: [279, 30, 55], hues: [0.8, 0.5], name: 'Purple' },
      { fg: [296, 70, 66], hues: [0.8, 0.6], name: 'Pink' },
    ],
    hasMono: true,
    probability: 0.22,
  },
  {
    name: 'Rocky',
    bgColor: [216, 20, 97],
    colors: [
      { fg: [20, 63, 55], hues: [0.9, 0.4], name: 'Orange' },
      { fg: [219, 30, 55], hues: [0.8, 0.6], name: 'Blue' },
      { fg: [253, 28, 55], hues: [0.8, 0.6], name: 'Purple' },
      { fg: [346, 80, 47], hues: [0.8, 0.6], name: 'Red' },
    ],
    hasMono: true,
    probability: 0.22,
  },
  {
    name: 'Carpathian',
    bgColor: [30, 50, 97],
    colors: [
      { fg: [32, 99, 68], hues: [0.9, 0.8], name: 'Gold' },
      { fg: [118, 66, 26], hues: [0.8, 0.2], name: 'Green' },
      { fg: [213, 55, 45], hues: [0.9, 0.8], name: 'Blue' },
      { fg: [215, 19, 41], hues: [0.8, 0.6], name: 'Slate' },
    ],
    hasMono: true,
    probability: 0.22,
  },
  {
    name: 'Vinicunca',
    bgColor: [4, 70, 98],
    colors: [
      { fg: [3, 99, 68], hues: [0.9, 0.6], name: 'Coral' },
      { fg: [185, 48, 45], hues: [0.9, 0.8], name: 'Teal' },
      { fg: [348, 100, 82], hues: [0.9, 0.6], name: 'Pink' },
      { fg: [350, 40, 50], hues: [0.8, 0.6], name: 'Red' },
    ],
    probability: 0.22,
  },

  {
    name: 'Arctic',
    bgColor: [203, 56, 8],
    colors: [
      { fg: [236, 100, 65], name: 'Purple' },
      { fg: [186, 92, 40], name: 'Cyan' },
      { fg: [293, 55, 68], name: 'Pink' },
      { fg: [172, 90, 55], name: 'Teal' },
    ],
    hasMono: false,
    probability: 0.08,
  },

  { // Duotones
    colors: [
      { fg: [32, 99, 68], bg: [346, 80, 47], name: 'Rocky Red and Carpathian Gold' },
      { fg: [236, 100, 65], bg: [32, 99, 68], name: 'Carpathian Gold and Arctic Purple' },
      { fg: [346, 80, 47], bg: [172, 90, 55], name: 'Arctic Teal and Rocky Red' },
      { fg: [172, 90, 55], bg: [236, 100, 65], name: 'Arctic Purple and Arctic Teal' },
    ],
    hasMono: false,
    probability: 0.04,
  },
];

const CANVAS_WIDTH_RATIO = 1.778; // TODO move this

const getUserConfig = (resolution) => {
  let userConfig = {};
  setUserConfigDimensions(userConfig, resolution);

  userConfig = {
    canvas: {
      ...userConfig.canvas,
    },
    drawing: {
      ...userConfig.drawing,
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
            name: `${pallete.name} Mono`,
          };
        }
        const color = pallete.colors[Math.floor(fxrand() * pallete.colors.length)];
        const hueRand = fxrand();
        const hueIndex = color.hues != null
          ? hueRand < hue1Probaility
            ? 0
            : hueRand < (hue1Probaility + hue2Probaility)
              ? 1
              : -1
          : -1;
        return {
          fg: color.fg,
          bg: color.bg ?? pallete.bgColor,
          hueMinRatio: hueIndex === -1 ? 1 : color.hues[hueIndex],
          name: pallete.name != null ? `${pallete.name} ${color.name}` : color.name,
          hueIndex,
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
            getYLength: () => userConfig.layers.yLengthBase,
          },
          getYOffset: () => userConfig.layers.yOffsetBase,
        },
        {
          strips: {
            getYLength: () => userConfig.layers.yLengthBase,
          },
          getYOffset: () => userConfig.layers.yOffsetBase,
        },

        // Partial A
        {
          strips: {
            getYLength: () => userConfig.layers.yLengthBase * 0.5,
          },
          getYOffset: () => userConfig.layers.yOffsetBase + 0.05,
          xStart: randomInt(1, 6) * 0.2,
        },
        {
          strips: {
            getYLength: () => userConfig.layers.yLengthBase * 0.5,
          },
          getYOffset: () => userConfig.layers.yOffsetBase + 0.05,
          xStart: randomInt(1, 6) * 0.2,
          getIsHidden: () => userConfig.layers.hasDoublePartial,
        },

        // Partial B
        {
          strips: {
            getYLength: () => userConfig.layers.yLengthBase * 0.5,
          },
          getYOffset: () => userConfig.layers.yOffsetBase + 0.05,
          xEnd: randomInt(1, 4) * 0.3,
        },
        {
          strips: {
            getYLength: () => userConfig.layers.yLengthBase * 0.5,
          },
          getYOffset: () => userConfig.layers.yOffsetBase + 0.05,
          xEnd: randomInt(1, 4) * 0.3,
          getIsHidden: () => userConfig.layers.hasDoublePartial,
        },
      ],

      hasDoublePartial: fxrand() < 0.75,
      stripVertexCount: 200,
      yLengthBase: randomInt(1, 3) * 0.2, 
      yOffsetBase: randomInt(2, 5) * 0.1,

      defaults: {
        drawWeight: 0.001,
        isBackground: false,
        isHidden: false,
        isInverted: false,
        strips: {
          xDensity: randomInt(2, 5) * 300,
          xDistortionRange: randomInt(1, 5) * 0.3,
          yLength: 1,
          yLengthRange: 0.3,
        },
        xOffset: 0,
        xTaperLength: 0.33 / CANVAS_WIDTH_RATIO,
        xStart: 0,
        xEnd: 1,
        getYIncrementalOffset: () => (5 + (randomInt(1, 3) * 3)) * 0.001 * userConfig.layers.yLengthBase,
        yOffset: 0,
      },
    },

    getBreaks: () => {	
      const breakTypes = [	
        {
          name: 'Diptych',
          probability: 0.10,	
          breaks: {	
            horizontal: [],	
            vertical: [	
              { at: 0.5, size: 0.025 },	
            ]	
          },	
        },	
        {
          name: 'Triptych',
          probability: 0.12,	
          breaks: {	
            horizontal: [],	
            vertical: [	
              { at: 0.3333, size: 0.025 },	
              { at: 0.6666, size: 0.025 },	
            ]	
          },	
        },	
        {
          name: 'Vertical Left',
          probability: 0.08,	
          breaks: {	
            horizontal: [],	
            vertical: [	
              { at: 0.3333, size: 0.025 },	
            ]	
          },	
        },	
        {
          name: 'Vertical Right',	
          probability: 0.08,	
          breaks: {	
            horizontal: [],	
            vertical: [	
              { at: 0.6666, size: 0.025 },	
            ]	
          },	
        },	
        {
          name: 'Horizontal',
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
          name: 'None',
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
      angle: fxrand() < 0.5
        ? randomInt(1, 3) * 20
        : randomInt(1, 4) * -15,
      gap: 0.015,
      length: { // multiplier of weight
        min: 5,
        max: 10,
      },
      yCutoff: 0.4,
      yCutoffRange: 0.1,
      weight: {
        min: 0.0003,
        max: 0.0009,
      },
    },

    sun: {
      isOn: fxrand() < 0.3,
      radius: randomFloat(0.08, 0.2),
      halo: {
        count: Math.max(0, (randomInt(0, 3) * 2) - 1),
        gap: 0.2,
        width: 0.05,
      },
      center: {
        xRatio: fxrand(),
        yRatio: fxrand(),
      }
    },
  };

  return userConfig;
};

export const setUserConfigDimensions = (userConfig, resolution) => {
  const DIMENSION = resolution != null
    ? resolution / CANVAS_WIDTH_RATIO
    : ((window.innerWidth / window.innerHeight > CANVAS_WIDTH_RATIO)
      ? window.innerHeight
      : (window.innerWidth / CANVAS_WIDTH_RATIO)
    );
  const CANVAS_HEIGHT = Math.round(DIMENSION);
  const CANVAS_HEIGHT_RATIO = 0.9;
  const CANVAS_WIDTH = Math.round(CANVAS_WIDTH_RATIO * DIMENSION);

  userConfig.canvas = {
    ...userConfig.canvas,
    dimension: DIMENSION,
    height: CANVAS_HEIGHT,
    width: CANVAS_WIDTH,
    heightRatio: 1,
    widthRatio: CANVAS_WIDTH_RATIO,
    aspectRatio: CANVAS_WIDTH_RATIO / 1,
  };

  const heightRatio = CANVAS_HEIGHT_RATIO;
  const widthRatio = CANVAS_WIDTH_RATIO + CANVAS_HEIGHT_RATIO - 1;

  userConfig.drawing = {
    ...userConfig.drawing,
    heightRatio,
    widthRatio,
    aspectRatio: widthRatio / heightRatio,
  };
};

export const setDerivedConfig = (config) => {
  const BORDER_Y_RATIO = (1 - config.user.drawing.heightRatio) / 2;
  const DRAWING_HEIGHT = config.user.drawing.heightRatio * config.user.canvas.height;
  const DRAWING_WIDTH = config.user.drawing.widthRatio * config.user.canvas.dimension;
  
  config.derived.drawing = {
    height: DRAWING_HEIGHT,
    width: config.user.drawing.widthRatio * config.user.canvas.dimension,
  
    topLeftX: (config.user.canvas.width - DRAWING_WIDTH) / 2,
    bottomRightX: config.user.canvas.width - (config.user.canvas.width - DRAWING_WIDTH) / 2,
    topLeftY: config.user.canvas.height * BORDER_Y_RATIO,
    bottomRightY: config.user.canvas.height * (1 - BORDER_Y_RATIO),
  };
  
  const NON_BACKGROUND_MIN_OFFSET = Math.min(...config.user.layers.layers
    .filter(l => !(l.isBackground ?? config.user.layers.defaults.isBackground))
    .map(l => l.yOffset ?? config.user.layers.defaults.yOffset)
  );
  config.derived.sun = {
    radius: config.user.sun.radius,
    center: {
      x: config.user.sun.center.xRatio,
      y: config.user.sun.center.yRatio * NON_BACKGROUND_MIN_OFFSET,
    },
  };
};

export const getConfig = (resolution) => {
  const config = {
    user: createConfig(getUserConfig(resolution)),
    derived: {},
  };

  setDerivedConfig(config);

  return config;
};

export function createConfig(config) {
  if (typeof config !== 'object') return config;
  if (Array.isArray(config)) return config.map(el => createConfig(el));
  return Object.keys(config).reduce(
    (acc, key) => {
      switch (typeof config[key]) {
        case 'object':
          acc[key] = createConfig(config[key]);
          break;
        case 'function':
          acc[`${key.charAt(3).toLowerCase()}${key.slice(4)}`] = config[key]();
          break;
        default:
          acc[key] = config[key];
      }
      return acc;
    },
    {},
  );
}

export function copyConfig(config) {
  if (typeof config !== 'object') return config;
  if (Array.isArray(config)) return config.map(el => copyConfig(el));
  return Object.keys(config).reduce(
    (acc, key) => {
      switch (typeof config[key]) {
        case 'object':
          acc[key] = copyConfig(config[key]);
          break;
        default:
          acc[key] = config[key];
      }
      return acc;
    },
    {},
  );
}