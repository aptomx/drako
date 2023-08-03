export const ERROR_TEMPLATE_EMAIL =
  'The email type is not found in the configured templates';
export const ERROR_DRIVER_EMAIL = 'Missing mail handler configuration.';
export const SWAGGER_SUMMARY_BASIC = 'Returns confirmation message';
export const ERROR_NOT_FOUND_REGISTER = (
  param: number | string,
  name = 'Id',
) => {
  return `Registro con ${name} '${param}' no encontrado`;
};
export const CREATED_RECORD = 'Registro creado';
export const UPDATED_RECORD = 'Registro actualizado';
export const DELETED_RECORD = 'Registro eliminado';
