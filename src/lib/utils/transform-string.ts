import { Logger } from '@nestjs/common';

const logger = new Logger('TransformString');

export function capitalizeFirstLetter(string: string) {
  try {
    return string.toLowerCase().replace(/^./, string[0].toUpperCase());
  } catch (error) {
    logger.error('Error in capitalizeFirstLetter', error?.stack);
    return string;
  }
}

export function capitalizeAllLetters(string: string) {
  try {
    return string
      .trim()
      .toLowerCase()
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
  } catch (error) {
    logger.error('Error in capitalizeAllLetters', error?.stack);
    return string;
  }
}
