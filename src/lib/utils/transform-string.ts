export function capitalizeFirstLetter(string: string) {
  try {
    return string.toLowerCase().replace(/^./, string[0].toUpperCase());
  } catch {
    return string;
  }
}
export function capitalizeAllLetters(string: string) {
  try {
    return string
      .trim()
      .toLowerCase()
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
  } catch {
    return string;
  }
}
