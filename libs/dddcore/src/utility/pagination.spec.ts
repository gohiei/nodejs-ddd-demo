import { Pagination } from './pagination';

describe('Pagination', () => {
  it('should be ok', () => {
    const pagination = Pagination.build(1, 20);

    expect(pagination.offset()).toBe(0);
    expect(pagination.limit()).toBe(20);
    expect(pagination.skip()).toBe(0);
    expect(pagination.take()).toBe(20);

    const dto = pagination.toDTO();
    expect(dto.Page).toBe(1);
    expect(dto.PageSize).toBe(20);

    const pagination2 = Pagination.build(3, 20);

    expect(pagination2.offset()).toBe(40);
    expect(pagination2.limit()).toBe(20);
    expect(pagination2.skip()).toBe(40);
    expect(pagination2.take()).toBe(20);

    const dto2 = pagination2.toDTO();
    expect(dto2.Page).toBe(3);
    expect(dto2.PageSize).toBe(20);

    const pagination3 = Pagination.build();
    expect(pagination3.offset()).toBe(0);
    expect(pagination3.limit()).toBe(100);
  });
});
