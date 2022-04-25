export const getBarRiseTextValue = value => {
  var res = value;
  if (res !== undefined) {
    if (value.toString().length === 2) {
      res = '0' + value.toString();
    }
    res = value.toString()[0] + 'm' + value.toString().slice(1);
  }
  return res;
};
