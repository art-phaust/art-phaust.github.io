function getPalette(config) {
  return config.user.drawing.colors.name;
}

function getHueVariation(config) {
  const { hueIndex } = config.user.drawing.colors;
  if (hueIndex === 0) return 'Subtle';
  if (hueIndex === 1) return 'Bold';
  return 'None';
}

function getBackground(config) {
  return config.user.layers.layers[1].isHidden
    ? 'Solo'
    : 'Duo';
}

function getLandforms(config) {
  const { yLengthBase } = config.user.layers
  if (yLengthBase <= 0.2) return 'Plains';
  if (yLengthBase <= 0.4) return 'Hills';
  return 'Mountains';
}

function getSun(config) {
  const { isOn, halo } = config.user.sun;
  if (!isOn) return 'None';
  if (halo.count === 0) return 'Fading';
  if (halo.count <= 1) return 'Watery';
  if (halo.count <= 3) return 'Glowing';
  return 'Scorching';
}

function getRain(config) {
  const { isOn, angle } = config.user.rain;
  if (!isOn) return 'None';
  if (angle <= -70) return 'Torrential';
  if (angle >= 60) return 'Lashing';
  if (angle <= -50) return 'Deluge';
  if (angle >= 40) return 'Pouring';
  if (angle <= -30) return 'Moderate';
  if (angle >= 20) return 'Drizzle';
  return 'Gentle';
}

function getBreaks(config) {
  return config.user.breaks.name;
}

function getDensity(config) {
  const { xDensity: density } = config.user.layers.defaults.strips;
  if (density <= 600) return 'Sparse';
  if (density <= 900) return 'Moderate';
  if (density <= 1200) return 'Packed';
  return 'Dense';
}

function getDistortion(config) {
  const { xDistortionRange: distortion } = config.user.layers.defaults.strips;
  if (distortion <= 0.3) return 'Organized';
  if (distortion <= 0.6) return 'Light';
  if (distortion <= 0.9) return 'Moderate';
  if (distortion <= 1.2) return 'Fuzzy';
  return 'Strong';
}

export function getFeatures(config) {
  return {
    'Palette': getPalette(config),
    'Hue Variation': getHueVariation(config),
    'Background': getBackground(config),
    'Landforms': getLandforms(config),
    'Sun': getSun(config),
    'Rain': getRain(config),
    // Name ?
    'Breaks': getBreaks(config),
    'Density': getDensity(config),
    'Distortion': getDistortion(config),
  };
}
