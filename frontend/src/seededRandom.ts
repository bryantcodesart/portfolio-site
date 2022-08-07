/* eslint-disable no-multi-assign */
/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */

/**
  * A sloppy hash that will return a (decently) unique number from a string
  * @param str string to
  * @returns hash
  */
export function seedFromString(str:string) {
  let hash = 0;
  let i;
  let chr;
  let len;
  if (typeof str.length === 'undefined' || str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

/**
 * Pseudo-random number generator algo mulberry32
 * @param seed (string or number!)
 * @returns a deterministic random number!
 */
export function seededRandom(seed:number|string) {
  let numericSeed: number;

  if (typeof seed === 'string') {
    numericSeed = seedFromString(seed);
  } else {
    numericSeed = seed;
  }
  let t = (numericSeed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
