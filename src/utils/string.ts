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
