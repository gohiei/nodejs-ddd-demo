import { InvalidPageError, InvalidPageSizeError } from './errors';
import { requireGreaterThan } from './require';

export function createDefaultPagination() {
  return Pagination.default();
}

export interface PaginationDTO {
  Page: number;
  PageSize: number;
  HasNext: boolean;
}

export class Pagination {
  private constructor(
    public readonly page: number,
    public readonly pageSize: number,
  ) {}

  static default() {
    return Pagination.build(1, 100);
  }

  static build(page: number = 1, pageSize: number = 100) {
    requireGreaterThan(page, 0, InvalidPageError);
    requireGreaterThan(pageSize, 0, InvalidPageSizeError);

    const p = new Pagination(Number(page), Number(pageSize));

    return p;
  }

  offset() {
    return this.pageSize * (this.page - 1);
  }

  limit() {
    return this.pageSize;
  }

  skip() {
    return this.offset();
  }

  take() {
    return this.pageSize;
  }

  toDTO(hasNext = false): PaginationDTO {
    return {
      Page: this.page,
      PageSize: this.pageSize,
      HasNext: hasNext,
    };
  }
}
