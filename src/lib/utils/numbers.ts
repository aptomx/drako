// biome-ignore lint/suspicious/noExplicitAny: Legacy utility function accepts multiple input types
export function formatNumbers(nStr: any, inD = '.', outD = '.', sep = ',') {
  if (typeof nStr === 'undefined' || isNaN(nStr) || nStr === null) {
    return '0.00';
  }

  nStr = parseFloat(nStr).toFixed(2);

  nStr += '';
  const dpos = nStr.indexOf(inD);
  let nStrEnd = '';
  if (dpos !== -1) {
    nStrEnd = outD + nStr.substring(dpos + 1, nStr.length);

    nStr = nStr.substring(0, dpos);
  }
  if (sep) {
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(nStr)) {
      nStr = nStr.replace(rgx, `$1${sep}$2`);
    }
  }
  return nStr + nStrEnd;
}

export function zeroPadNumbers(num: number, places = 10) {
  return String(num).padStart(places, '0');
}
