export class OrderBy<T = string> {
  public readonly sort: T;
  public readonly order: 'ASC' | 'DESC';

  constructor(sort: T, order: string) {
    this.sort = sort;

    if (order) {
      const dir = order.toUpperCase();
      this.order = dir === 'ASC' || dir === 'DESC' ? dir : 'DESC';
    }
  }

  static build(sort: string, order: string = 'ASC') {
    return new OrderBy<string>(sort, order);
  }
}
