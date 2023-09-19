import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/es';
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');
dayjs.extend(updateLocale);
dayjs.updateLocale('es', {
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
});
// Date in db only Date (save)-> dayjs('2023-06-09', 'YYYY-MM-DD').toISOString() -> preview correct: dayjs(value).utc().format('YYYY-MM-DD')
// Date in db only Time (save)-> dayjs('09:00:00', 'HH:mm:ss').toISOString()     -> preview correct: dayjs(value).format('hh:mm A')

// Date in db only Date (search)-> [dayjs(dateStart).utc().startOf('d').format() , dayjs(dateEnd).utc().endOf('d').format()]
// Date in db only Time (search)-> dayjs(dayjs().format(`YYYY-MM-DD`) + ` ${19:00:00}`).utc().format();
export function formatDateStart(dateStart: string) {
  return dayjs(dateStart).startOf('d').format();
}

export function formatDateEnd(dateEnd: string) {
  return dayjs(dateEnd).endOf('d').format();
}
