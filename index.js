// constant for return zero numbers in return
const ZERO = 0;

// maximum avalible number in this library
const MAX = 99999999999999;

// values for convert zero counts to character class number
const DEFAULT_CLASS_VALUES = {
  0: "",
  4: "K",
  7: "M",
  10: "B",
  13: "T",
};

const SUPERSCRIPTS_NUMBERS = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉'
}

const compose =
  (...functions) =>
  (input) =>
    functions.reduceRight((acc, fn) => fn(acc), input);

const addSuffix = (str, suffix) => `${str}${suffix}`;
const addPrefix = (str, prefix) => addSuffix(prefix, str);

// convert numbers to subscript font
const numberToSubscript = (num) => {
  let str = num.toString().split('')

  for (let i = 0; i < str.length; ++i) {
    str[i] = SUPERSCRIPTS_NUMBERS[str[i]]
  }

  return str.join('')
}

// this function return natural logarithm for number and increment return number
const rankNumber = (n) =>
  compose((x) => x + 1, Math.floor, Math.log10, Math.abs)(n);

// function for convert class values keys to numbers type
const objectKeysToNumbers = (obj) =>
  Object.keys(obj).map((n) => Number.parseInt(n));

const arrayClosestValue = (array, value) =>
  array.reduce((previous, current) =>
    value / current >= 1 && value / current < value / previous
      ? current
      : previous
  );

// main function for use
export const cryptoPretty = (
  num,
  classValues = DEFAULT_CLASS_VALUES,
  decimals = 2
) => {
  const privateNum = Math.abs(num);
  const symbol = num < ZERO ? "-" : "";

  if (privateNum === undefined || privateNum === null) {
    throw new Error(
      "First argument not found. Number require for pretty function."
    );
  }

  if (privateNum > MAX) {
    throw new Error("Number greater 99.99T not working in this library");
  }

  const shortVariant = () => {
    if (privateNum === ZERO) {
        return privateNum.toString(); 
    }

    const rank = rankNumber(privateNum);
    if (privateNum > ZERO && privateNum < 1) {
      if (rank >= -3) { 
        return addPrefix(privateNum.toFixed(4).toString(), symbol);
      }

      const absRank = Math.abs(rank);

      let str = privateNum.toLocaleString().slice(0, 3); // 3 number start symbols: 0.0

      str += `.0${numberToSubscript(absRank - 1)}${Math.trunc(privateNum * Math.pow(10, absRank + 1))}`; // formatting number
      return addPrefix(str, symbol);
    }

    const k = rank / 3; // 1.000, 10.000, 100.000;
    const greaterK = Math.ceil(k); // (11 / 3) ~ 3.6 (+1 to 12)
    const greaterRank = greaterK * 3; // greater point, if rank equal 11, greater rank equal 12, because 12 mod 3 = 0

    const result = privateNum / Math.pow(10, greaterRank - 3); // split number

    const str = result.toString().slice(0, decimals + 4 - greaterRank + rank);  // formatting number

    const objectKeys = objectKeysToNumbers(classValues); // object keys to numbers array
    const closestValue = arrayClosestValue(objectKeys, rank); // search closest value for rank number

    return addSuffix(addPrefix(str, symbol), classValues[closestValue]);
  };

  const value = privateNum.toString();

  return {
    shortVariant,
    value,
  };
};
