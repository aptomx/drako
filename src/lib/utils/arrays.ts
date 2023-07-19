export const arrayDifference = (arrBase: [], arrDifferences: []) => {
  return arrBase.filter((elemento) => arrDifferences.indexOf(elemento) == -1);
};
