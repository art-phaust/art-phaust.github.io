import { getSketch } from './pointila';
import { getFeatures } from './features';

const repeatIndex = parseInt(new URLSearchParams(window.location.search).get('repeat') ?? '1', 10);
const collectionName = new URLSearchParams(window.location.search).get('collectionName');
const doNotAnimate = new URLSearchParams(window.location.search).get('animate') === 'false';
const doDebug = new URLSearchParams(window.location.search).get('debug') === 'true';
const resolution = parseInt(new URLSearchParams(window.location.search).get('resolution') ?? '0', 10);

if (doDebug) {
  console.log(`repeat: ${repeatIndex}`);
  console.log(`hash: ${fxhash}`);
}

getSketch({
  doNotAnimate,
  doDebug,
  resolution: resolution ? resolution : undefined,
  onInit: (config) => {
    window.$fxhashFeatures = getFeatures(config);
  },
  onDone: (p5Save) => {
    fxpreview();
    if (doDebug) {
      console.log();
      console.log('---');
    }

    if (collectionName != null) p5Save(`${collectionName}_${repeatIndex}-${fxhash}.png`);
    if (repeatIndex > 1) setTimeout(
      () => {
        let newUrl =
          `${window.location.protocol}//${window.location.host + window.location.pathname}?repeat=${repeatIndex - 1}`;
        if (collectionName != null) newUrl += `&collectionName=${collectionName}`;
        if (doNotAnimate) newUrl += '&animate=false';
        if (doDebug) newUrl += '&debug=true';
        if (resolution) newUrl += `&resolution=${resolution}`;

        window.location.href = newUrl;
      },
      1000,
    );
  },
});
