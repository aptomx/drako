import { cast, col, fn, where } from 'sequelize';

export function conditionLike(field: string, search: string) {
  return where(fn('LOWER', col(field)), 'LIKE', `%${search.toLowerCase()}%`);
}

export function conditionLikeNumber(field: string, search: string) {
  return where(
    cast(col(field), 'VARCHAR'),
    'LIKE',
    `%${search.toLowerCase()}%`,
  );
}
