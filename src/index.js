import p5 from 'p5';
import { DIMENSION, CANVAS_HEIGHT, CANVAS_WIDTH, STRIP_VERTEX_COUNT, getUserConfig, createConfig } from './config';

let USER_CONFIG;

const REPEAT_COUNT = parseInt(new URLSearchParams(window.location.search).get('repeat') ?? '1', 10);
let repeatIndex = 0;

const DO_ANIMATE = new URLSearchParams(window.location.search).get('animate') === 'true' && REPEAT_COUNT === 1;
let frameIndex = 0;

let CANVAS;
let CONFIG;
let STRIPS_FOR_LAYERS;
let RAINDROPS;

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
    .filter(l => !(l.isHidden ?? CONFIG.user.layers.defaults.isHidden));
}

function getIsInSun(x, y, isBackground) {
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
  
    const hue =
      Math.round(((fgColor[0] - (((layers.length - 1) - layerIndex) * (1 - (hueMinRatio ?? 1)) * 360 / layers.length - 1)) + 360) % 360);
    const saturation = fgColor[1];
    const lightness = fgColor[2];

    for (let i = 0; i < strips.length; i++) {
      const verticesForStrip = [];
      let prevIsInSun = getIsInSun(strips[i][0].x, strips[i][0].y, isBackground);
      let fillColor = [hue, saturation, lightness, prevIsInSun ? 0 : 1];
      for (let j = 0; j < stripVertexCount; j++) {
        const { x, y, doNotPlot } = strips[i][j];
        const isInSun = getIsInSun(x, y, isBackground);
        if (!prevIsInSun && isInSun) {
          fillColor = [hue, saturation, lightness, 0];
        } else if (prevIsInSun && !isInSun) {
          fillColor = [hue, saturation, lightness];
        }
        prevIsInSun = isInSun;

        verticesForStrip.push({
          x, y,
          color: fillColor,
          weight: !(doNotPlot || getIsTapered(i, j, strips.length, stripVertexCount, xStart, xEnd, xTaperLength))
            ? drawWeight
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
