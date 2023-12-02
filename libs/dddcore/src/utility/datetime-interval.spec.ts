import { DateTime } from './datetime';
import { DateTimeInterval } from './datetime-interval';

describe('DatetimeInterval', () => {
  it('should be ok', () => {
    const interval = DateTimeInterval.build(undefined, undefined);
    expect(interval.isValid()).toBeFalsy();

    const interval2 = DateTimeInterval.build('ok', 'what');
    expect(interval2.isValid()).toBeFalsy();

    const interval3 = DateTimeInterval.build(new DateTime().add(-3, 'days'), new DateTime());
    expect(interval3.isValid()).toBeTruthy();

    const interval4 = DateTimeInterval.build('2023-12-01 00:00:00', '2023-12-09 23:59:59');
    expect(interval4.isValid()).toBeTruthy();
  });
});
