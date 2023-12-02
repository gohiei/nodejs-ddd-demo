import * as Dayjs from 'dayjs';
import * as Duration from 'dayjs/plugin/duration';
import * as IsoWeek from 'dayjs/plugin/isoWeek';
import * as Timezone from 'dayjs/plugin/timezone';
import * as Utc from 'dayjs/plugin/utc';

Dayjs.extend(IsoWeek);
Dayjs.extend(Utc); // timezone dependent on utc plugin
Dayjs.extend(Timezone);
Dayjs.extend(Duration);

type DateTimeUnit = Dayjs.ManipulateType;

export const T_DATE = 'YYYY-MM-DD';
export const T_DATE_EN = 'YYYY-MMM-DD';
export const T_DATETIME = 'YYYY-MM-DD HH:mm:ss';
export const T_DATETIME_WITH_T = 'YYYY-MM-DDTHH:mm:ss';
export const T_HOUR = 'HH:mm';
export class DateTime {
  private dayjs: Dayjs.Dayjs;

  constructor(date?: string | Date | number | Dayjs.Dayjs) {
    this.dayjs = Dayjs(date);
  }

  format(template = T_DATETIME) {
    if (!this.dayjs.isValid()) {
      return null;
    }

    return this.dayjs.format(template);
  }

  add(v: number, unit?: DateTimeUnit) {
    const dayjs = this.dayjs.add(v, unit);

    return new DateTime(dayjs);
  }

  toDate(): Date {
    if (!this.dayjs.isValid()) {
      return null;
    }

    return this.dayjs.toDate();
  }

  isValid(): boolean {
    return this.dayjs.isValid();
  }

  isBefore(t: DateTime): boolean {
    return this.dayjs.isBefore(t.getDayjs());
  }

  getDayjs(): Dayjs.Dayjs {
    return this.dayjs;
  }
}
