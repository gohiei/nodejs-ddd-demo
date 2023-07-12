import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { OutsideRepository } from '../repository/outside.repository';

@Injectable()
export class TestApiOutsideRepository implements OutsideRepository {
  constructor(private readonly client: HttpService) {}

  async getEchoData(): Promise<any> {
    const req = this.client
      .get('https://api.publicapis.org/categories')
      .pipe(map((res) => res.data));

    const data = await lastValueFrom(req);
    return data;
  }
}
