import { OrderBy } from './order-by';

describe('OrderBy', () => {
  it('should be ok', () => {
    const orderBy = OrderBy.build('a', 'DESC');

    expect(orderBy.sort).toBe('a');
    expect(orderBy.order).toBe('DESC');

    const orderBy2 = OrderBy.build('b', 'ASC');

    expect(orderBy2.sort).toBe('b');
    expect(orderBy2.order).toBe('ASC');

    const orderBy3 = OrderBy.build('c');

    expect(orderBy3.sort).toBe('c');
    expect(orderBy3.order).toBe('ASC');

    const orderBy4 = OrderBy.build('d', 'WRONG');

    expect(orderBy4.sort).toBe('d');
    expect(orderBy4.order).toBe('DESC');
  });
});
