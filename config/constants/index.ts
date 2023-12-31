export const DEFAULT_LIMIT_IN_MB_OF_FILES = 15;
export const ENTITIES_SRC = 'src/modules/**';
export const MIGRATION_SRC = 'src/modules/database/migrations';
export const SEEDS_SRC = 'src/modules/database/seeds';
export const ERROR_GET_SIZE =
  'Measurements setting for image resizing not found';
export const DEFAULT_PAGE = 1;
export const DEFAULT_PERPAGE = 10;
export const DEFAULT_PAGINATE = 'true';
export const SOCIAL_NETWORK_TOKEN_ERROR = (driver) => {
  return `Token de '${driver}' no válido`;
};
export const SOCIAL_NETWORK_EMAIL_ERROR = (driver) => {
  return `No se puede validar el correo electrónico debido a permisos de su cuenta de ${driver}. Intente iniciar sesión con otro método`;
};
