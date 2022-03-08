import { generate } from './markov';
import { calculateStats } from './stats';
import { mountains, features } from './words';

const ORDER = 2;

let name;
export default function getName() {
  if (name == null) {
    name = `${
      generate(calculateStats(mountains, ORDER), 5, 9) ?? mountains[Math.floor(fxrand() * mountains.length)]
    } ${
      generate(calculateStats(features, ORDER), 4, 7) ?? features[Math.floor(fxrand() * features.length)]
    }`;
  }
  return name;
}
