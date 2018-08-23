export const byKey = (arr: any[], key: string): { [key: string]: any } =>
  arr.reduce((tmp, item) => {
    tmp[item[key]] = item;
    return tmp;
  }, {});
