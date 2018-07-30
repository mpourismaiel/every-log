export const prettifyPrice = (price: number | string) =>
  price
    .toString()
    .replace(/,/g, '')
    .replace(/^(0|۰)*/g, '')
    .replace(/[^0-9۰۱۲۳۴۵۶۷۸۹]/g, '')
    .split('')
    .reverse()
    .reduce((tmp, int, i, arr) => {
      tmp += int;
      if (i > 0 && i < arr.length - 1 && (i + 1) % 3 === 0) {
        tmp += ',';
      }

      return tmp;
    }, '')
    .split('')
    .reverse()
    .join('');

export const toColor = (text: string, factor: number = 1) =>
  '#' +
  text
    .split('')
    .reduce(
      (tmp, char, i, arr) => {
        tmp[Math.floor((i / arr.length) * 6)] += char;
        return tmp;
      },
      ['', '', ''],
    )
    .map(slice =>
      slice.split('').reduce((tmp, char) => {
        tmp += char.charCodeAt(0);
        return tmp;
      }, 0),
    )
    .map(num => (num * factor) % 16)
    .reduce((tmp, num) => {
      tmp += '0123456789ABCDEF'[num];
      return tmp;
    }, '');
