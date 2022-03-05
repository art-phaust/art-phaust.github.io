import p5 from 'p5';
import { getConfig, copyConfig, setDerivedConfig, setUserConfigDimensions } from './config';
import { getFeatures  } from './features';
import { randomFloat, convertLocalToCanvasCoordinates } from './utils';

function isInsideBounds(x, y, config) {
  return (
    y >= 0 && y <= 1
  ) && (
    !config.user.breaks.horizontal.find(({ at, size }) => y >= (at - size / 2) && y <= (at + size / 2))
  ) && (
    !config.user.breaks.vertical.find(({ at, size }) => x >= (at - size / 2) && x <= (at + size / 2))
  );
}

function getLayersFromConfig(config) {
  return config.user.layers.layers
    .filter(l => !(l.isHidden ?? config.user.layers.defaults.isHidden));
}

function getIsInSun(x, y, isBackground, config) {
  const distanceFromSunCenter = Math.sqrt(
    ((x - (config.derived.sun.center.x)) * config.user.drawing.aspectRatio)**2 +
    ((y - (config.derived.sun.center.y)))**2
  );
  if (!(config.user.sun.isOn && isBackground)) return false;
  if (distanceFromSunCenter <= config.derived.sun.radius) return true;
  for (let i = 1; i <= config.user.sun.halo.count; i++) {
    if (
      distanceFromSunCenter >= config.derived.sun.radius * ((1 + i * config.user.sun.halo.gap) - config.user.sun.halo.width / 2) &&
      distanceFromSunCenter <= config.derived.sun.radius * ((1 + i * config.user.sun.halo.gap) + config.user.sun.halo.width / 2)
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

function getLayers(config) {
  const stripsForLayers = [];
  const raindrops = [];

  const layers = getLayersFromConfig(config);

  const { fg: fgColor, hueMinRatio } = config.user.drawing.colors;

  for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
    const layer = layers[layerIndex];

    const stripsForLayer = [];

    const drawWeight = layer.drawWeight ?? config.user.layers.defaults.drawWeight;
    const isBackground = layer.isBackground ?? config.user.layers.defaults.isBackground;
    const isInverted = layer.isInverted ?? config.user.layers.defaults.isInverted;
    const stripXDensity = layer.strips.xDensity ?? config.user.layers.defaults.strips.xDensity;
    const stripXDistortionRange = layer.strips.xDistortionRange ?? config.user.layers.defaults.strips.xDistortionRange;
    const stripYLength = layer.strips.yLength ?? config.user.layers.defaults.strips.yLength;
    const stripYLengthRange = layer.strips.yLengthRange ?? config.user.layers.defaults.strips.yLengthRange;
    const stripVertexCount = config.user.layers.stripVertexCount;
    const xTaperLength = layer.xTaperLength ?? config.user.layers.defaults.xTaperLength;
    const xOffset = layer.xOffset ?? config.user.layers.defaults.xOffset;
    const xStart = layer.xStart ?? config.user.layers.defaults.xStart;
    const xEnd = layer.xEnd ?? config.user.layers.defaults.xEnd;
    const yIncrementalOffset = layer.yIncrementalOffset ?? config.user.layers.defaults.yIncrementalOffset;
    const yOffset = layer.yOffset ?? config.user.layers.defaults.yOffset;

    const stripCount = Math.round(stripXDensity * config.user.drawing.aspectRatio);
    const stripWidth = 1 / stripCount;
    const stripXDistortion = stripXDistortionRange * config.user.drawing.aspectRatio * stripWidth;

    const initialYOffset = yOffset;

    // this a hacky fix to a broken animation caused by a hacky solution to hide a layer
    // but we didn't want to change anything major at this late stage
    if (xStart >= 1) continue;

    let stripX = xOffset;
    let stripY = isInverted ? 1 - initialYOffset : initialYOffset;
    const strips = [];
    [...Array(stripCount + 1)].forEach(() => {
      const newStripY = stripY + randomFloat(-yIncrementalOffset, yIncrementalOffset);
      if (newStripY < 0) stripY += randomFloat(0, yIncrementalOffset)
      else if (newStripY > 1) stripY += randomFloat(-yIncrementalOffset, 0);
      else stripY = newStripY;
      strips.push(generateStrip(
        stripX, stripY,
        stripVertexCount, stripXDistortion, stripYLength, stripYLengthRange,
        isInverted,
        config,
      ));
      stripX += stripWidth;
    });
  
    const hue = Math.round(
      ((fgColor[0] - (((layers.length - 1) - layerIndex) * (1 - (hueMinRatio ?? 1)) * 360 / layers.length - 1)) + 360) % 360
    );
    const saturation = fgColor[1];
    const lightness = fgColor[2];

    for (let i = 0; i < strips.length; i++) {
      const verticesForStrip = [];
      let prevIsInSun = getIsInSun(strips[i][0].x, strips[i][0].y, isBackground, config);
      let fillColor = [hue, saturation, lightness, prevIsInSun ? 0 : 1];
      for (let j = 0; j < stripVertexCount; j++) {
        const { x, y, doNotPlot } = strips[i][j];
        const isInSun = getIsInSun(x, y, isBackground, config);
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
    stripsForLayers.push(stripsForLayer);
  }

  if (config.user.rain.isOn) {
    for (const mode of ['y', 'x']) {
      let rainStartingX = config.user.rain.angle >= 0 ? 0 : 1;
      let rainStartingY = mode === 'y' ? config.user.rain.yCutoff : 0
      while (true) {
        let stripX = rainStartingX;
        let stripY = rainStartingY;
        let lastWasRain = true;
        const rainStripYCutoff =
          config.user.rain.yCutoff * (1 + randomFloat(-config.user.rain.yCutoffRange, config.user.rain.yCutoffRange));
        while (true) {
          const weight = randomFloat(config.user.rain.weight.min, config.user.rain.weight.max);
          const length = weight * randomFloat(config.user.rain.length.min, config.user.rain.length.max);
          stripY += randomFloat(-length, length) * Math.cos(config.user.rain.angle * (Math.PI / 180));
          const endStripX = stripX + length * Math.sin(config.user.rain.angle * (Math.PI / 180));
          const endStripY = stripY + length * Math.cos(config.user.rain.angle * (Math.PI / 180)) * config.user.drawing.aspectRatio;
          if (endStripX > 1 || endStripY > 1 || endStripX < 0 || endStripY < 0) break;
    
          if (!lastWasRain) {
            raindrops.push({ xStart: stripX, yStart: stripY, xEnd: endStripX, yEnd: endStripY, weight });
          }
          stripX = endStripX;
          stripY = endStripY;
          
          if (stripY > rainStripYCutoff) break;
          lastWasRain = !lastWasRain;
        }

        if (mode === 'y') {
          rainStartingY -= config.user.rain.gap * Math.sin((90 - config.user.rain.angle) * (Math.PI / 180));
          if (rainStartingY < 0) break;
        } else {
          rainStartingX += config.user.rain.gap * Math.cos((90 - config.user.rain.angle) * (Math.PI / 180)) / config.user.drawing.aspectRatio;
          if (config.user.rain.angle >= 0) {
            if (rainStartingX > 1) break;
          } else {
            if (rainStartingX < 0) break;
          }
        }
      }
    }
  }

  return {
    stripsForLayers,
    raindrops,
  };
}

function generateStrip(
  stripX, stripY,
  stripVertexCount, stripXDistortion, stripYLength, stripYLengthRange,
  isInverted,
  config,
) {
  const strip = [];

  const stripLength = stripYLength * (1 + randomFloat(-stripYLengthRange, stripYLengthRange));

  for (let i = 0; i < stripVertexCount; i++) {
    const x = stripX + randomFloat(-stripXDistortion, stripXDistortion);
    const y = stripY + (stripLength / stripVertexCount) * (isInverted ? -i : i);

    strip.push({ x, y, doNotPlot: !isInsideBounds(x, y, config) });
  }

  return strip;
}

const sketch = ({ doNotAnimate, doDebug, resolution, onInit, onDone }) => (p5) => {
  let config;
  let layers;

  let frameIndex = 0;
  let animationLayerIndex = 0;
  let animationVertexIndex = 0;

  p5.setup = () => {
    config = getConfig(resolution);
    if (doDebug) {
      console.log(`config: ${JSON.stringify(config, null, 2)}`);
      console.log(`features: ${JSON.stringify(getFeatures(config), null, 2)}`);
    }

    layers = getLayers(config);
  
    p5.colorMode(p5.HSL);
    p5.createCanvas(config.user.canvas.width, config.user.canvas.height);

    onInit(config);
  }

  p5.draw = () => {
    if (frameIndex === 0) {
      p5.background(...config.user.drawing.colors.bg);
      p5.loop();
    }
    p5.noStroke();
    const animationRate = doNotAnimate ? Number.MAX_SAFE_INTEGER : animationLayerIndex + 1;
    const doEvaluateLayers = animationLayerIndex < layers.stripsForLayers.length;
    const doEvaluateRain = doNotAnimate || animationLayerIndex === layers.stripsForLayers.length;
    const doExit = doNotAnimate || animationLayerIndex > layers.stripsForLayers.length;
    if (doEvaluateLayers) {
      for (const stripsForLayer of (doNotAnimate ? layers.stripsForLayers : [layers.stripsForLayers[animationLayerIndex]])) {
        for (const stripForLayer of stripsForLayer) {
          for (let i = 0; i < Math.min(animationRate, stripForLayer.length); i++) {
            const vertex = stripForLayer[animationVertexIndex + i];
            if (vertex != null) {
              const { x, y, color, weight } = vertex;
              p5.fill(...color);
              p5.ellipse(
                ...convertLocalToCanvasCoordinates(x, y, config),
                weight * config.user.canvas.dimension,
              );
            }
          }
        }
      }
      animationVertexIndex += animationRate;
      if (animationVertexIndex + 1 >= config.user.layers.stripVertexCount) {
        animationLayerIndex++;
        animationVertexIndex = 0;
      }
    }

    if (doEvaluateRain) {
      if (config.user.rain.isOn) {
        for (
          const raindrop of layers.raindrops
            .filter(r => r.yStart >= animationVertexIndex && r.yStart < animationVertexIndex + animationRate)
        ) {
          const { xStart, yStart, xEnd, yEnd, weight } = raindrop;
          p5.beginShape();
          p5.stroke(...config.user.drawing.colors.bg);
          p5.strokeWeight(weight * config.user.canvas.dimension * (900 / config.user.layers.defaults.strips.xDensity));
          p5.vertex(...convertLocalToCanvasCoordinates(xStart, yStart, config));
          p5.vertex(...convertLocalToCanvasCoordinates(xEnd, yEnd, config));
          p5.endShape();
        }

        if (animationVertexIndex > config.derived.drawing.height) animationLayerIndex++
        else animationVertexIndex += animationRate;
      } else {
        animationLayerIndex++;
      }
    }

    if (doExit) {
      if (doDebug) {
        const featureText =
          JSON.stringify(getFeatures(config)).slice(1, -1).replaceAll('"', '').replaceAll(',', ', ') +
          `, yInc: ${config.user.layers.defaults.yIncrementalOffset}`;
        const textSize = Math.round(16 * (config.user.canvas.dimension / (5 * featureText.length)));
        p5.textSize(textSize);
        const [x, y] = convertLocalToCanvasCoordinates(0, 1, config);
        p5.text(featureText, x, y + textSize * 1.5);
      }
      p5.noLoop();
      onDone((filename) => p5.saveCanvas(filename));
    }

    frameIndex++;
  }

  p5.windowResized = () => {
    if (!resolution) {
      frameIndex = 0;
      animationLayerIndex = 0;
      animationVertexIndex = 0;
      setUserConfigDimensions(config.user);
      setDerivedConfig(config);
      p5.resizeCanvas(config.user.canvas.width, config.user.canvas.height);
    }
  }

  p5.keyPressed = function () {
    if (p5.keyCode === 83) { // letter s
      p5.saveCanvas(`pointilla-${config.user.canvas.dimension}.png`);
    } else if (p5.keyCode === 75) { // letter k
      const resolution = 4000;
      const heightResolution = Math.ceil(resolution / config.user.canvas.widthRatio);
      const highQualityConfig = copyConfig(config);
      setUserConfigDimensions(highQualityConfig.user, heightResolution);
      setDerivedConfig(highQualityConfig);
      const highQuality = p5.createGraphics(resolution, heightResolution);
      highQuality.colorMode(p5.HSL);
      highQuality.background(...highQualityConfig.user.drawing.colors.bg);
      highQuality.noStroke();
  
      for (const vertex of layers.stripsForLayers.flat().flat()) {
        if (vertex != null) {
          const { x, y, color, weight } = vertex;
          highQuality.fill(...color);
          highQuality.ellipse(
            ...convertLocalToCanvasCoordinates(x, y, highQualityConfig),
            weight * highQualityConfig.user.canvas.dimension,
          );
        }
      }
      for (const raindrop of layers.raindrops) {
        const { xStart, yStart, xEnd, yEnd, weight } = raindrop;
        highQuality.beginShape();
        highQuality.stroke(...highQualityConfig.user.drawing.colors.bg);
        highQuality.strokeWeight(weight * highQualityConfig.user.canvas.dimension);
        highQuality.vertex(...convertLocalToCanvasCoordinates(xStart, yStart, highQualityConfig));
        highQuality.vertex(...convertLocalToCanvasCoordinates(xEnd, yEnd, highQualityConfig));
        highQuality.endShape();
      }
      highQuality.save(`pointilla-${resolution}.png`); 
    }
  }
}

export const getSketch = (config) => new p5(sketch(config), 'sketch-canvas');
