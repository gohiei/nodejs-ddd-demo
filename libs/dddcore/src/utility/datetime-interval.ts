import { DateTime } from './datetime';
import { InvalidStartEndDateError } from './errors';
import { requireTrue } from './require';

export class DateTimeInterval {
  private constructor(
    public readonly start: DateTime,
    public readonly end: DateTime,
  ) {}

  static build(start: DateTime | string | Date, end: DateTime | string | Date) {
    if (!(start instanceof DateTime)) {
      start = new DateTime(start || 'undefined');
    }

    if (!(end instanceof DateTime)) {
      end = new DateTime(end || 'undefined');
    }

    if (start.isValid() && end.isValid()) {
      requireTrue(start.isBefore(end), InvalidStartEndDateError);
    }

    return new DateTimeInterval(start, end);
  }

  isValid(): boolean {
    return this.start.isValid() && this.end.isValid();
  }
}
