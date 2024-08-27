export const ERROR_TEMPLATE_EMAIL =
  'El tipo de correo electrónico no se encuentra en las plantillas configuradas';
export const ERROR_DRIVER_EMAIL =
  'Falta la configuración del controlador de correo';
export const SWAGGER_SUMMARY_BASIC = 'Devuelve un mensaje de confirmación';
export const ERROR_NOT_FOUND_REGISTER = (
  param: number | string,
  name = 'Id',
) => {
  return `Registro con ${name} '${param}' no encontrado`;
};
export const ERROR_USER_EXIST =
  'El correo electrónico ya se encuentra registrado';
export const SOCIAL_NETWORK_TOKEN_ERROR = (driver) => {
  return `Token de '${driver}' no válido`;
};
export const SOCIAL_NETWORK_EMAIL_ERROR = (driver) => {
  return `No se puede validar el correo electrónico debido a permisos de su cuenta de ${driver}. Intente iniciar sesión con otro método`;
};
