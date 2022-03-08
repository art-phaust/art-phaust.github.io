import getName from './markov';

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

function getProminence(config) {
  const { yLengthBase } = config.user.layers
  if (yLengthBase <= 0.2) return 'Shallow';
  if (yLengthBase <= 0.4) return 'Gradual';
  return 'Sheer';
}

function getSun(config) {
  const { isOn, halo } = config.user.sun;
  if (!isOn) return 'None';
  if (halo.count === 0) return 'Mellow';
  if (halo.count <= 1) return 'Hazy';
  if (halo.count <= 3) return 'Glowing';
  return 'Scorching';
}

function getRain(config) {
  const { isOn, angle } = config.user.rain;
  if (!isOn) return 'None';
  if (angle <= -70) return 'Howling';
  if (angle >= 60) return 'Lashing';
  if (angle <= -50) return 'Pounding';
  if (angle >= 40) return 'Pouring';
  if (angle <= -30) return 'Steady';
  if (angle >= 20) return 'Light';
  return 'Gentle';
}

function getBreaks(config) {
  return config.user.breaks.name;
}

function getDensity(config) {
  const { xDensity: density } = config.user.layers.defaults.strips;
  if (density <= 600) return 'Sparse';
  if (density <= 900) return 'Light';
  if (density <= 1200) return 'Crowded';
  return 'Heavy';
}

function getDistortion(config) {
  const { xDistortionRange: distortion } = config.user.layers.defaults.strips;
  if (distortion <= 0.3) return 'Sharp';
  if (distortion <= 0.6) return 'Tidy';
  if (distortion <= 0.9) return 'Vague';
  if (distortion <= 1.2) return 'Woozy';
  return 'Fuzzy';
}

export function getFeatures(config) {
  return {
    'Palette': getPalette(config),
    'Hue Variation': getHueVariation(config),
    'Background': getBackground(config),
    'Prominence': getProminence(config),
    'Sun': getSun(config),
    'Rain': getRain(config),
    'Name': getName(),
    'Breaks': getBreaks(config),
    'Density': getDensity(config),
    'Distortion': getDistortion(config),
  };
}
