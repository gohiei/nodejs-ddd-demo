import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { AxiosResponse } from 'axios';
import {
  AxiosInterceptor,
  AxiosFulfilledInterceptor,
  AxiosRejectedInterceptor,
} from '@narando/nest-axios-interceptor';
import { EventBus } from '@lib/dddcore/event.bus';
import { EVENT_BUS } from '@lib/dddcore/dddcore.constant';
import {
  HTTPRequestDoneEvent,
  Payload,
} from '../../entity/http-request-done.event';

export interface LoggingAxiosInterceptorDecoder {
  do(input: string): string;
}

export class JSONDecoder implements LoggingAxiosInterceptorDecoder {
  do(input) {
    return JSON.stringify(input);
  }
}

@Injectable()
export class LoggingAxiosInterceptor extends AxiosInterceptor {
  private decoder: LoggingAxiosInterceptorDecoder;

  constructor(
    httpService: HttpService,
    @Inject(EVENT_BUS) private readonly eventBus: EventBus,
  ) {
    super(httpService);

    this.decoder = new JSONDecoder();
  }

  setDecoder(decoder: LoggingAxiosInterceptorDecoder) {
    this.decoder = decoder;
  }

  responseFulfilled(): AxiosFulfilledInterceptor<AxiosResponse> {
    return (response) => {
      const { config: req } = response;
      const decoder: LoggingAxiosInterceptorDecoder = this.decoder;

      const log: Payload = {
        at: new Date(),
        method: req.method,
        origin: req.url,
        host: req.baseURL,
        req_header: JSON.stringify(req.headers),
        req_body: decoder.do(req.data),
        status_code: response.status,
        latency: 2,
        res_header: JSON.stringify(response.headers),
        res_body: decoder.do(response.data),
        error: undefined,
      };

      this.eventBus.post(new HTTPRequestDoneEvent(log));

      return response;
    };
  }

  responseRejected(): AxiosRejectedInterceptor {
    return (err) => {
      if (!this.isAxiosError(err)) {
        console.error('Unexpected generic error', err);
      }

      const { config: req, response } = err;
      const decoder: LoggingAxiosInterceptorDecoder = this.decoder;

      const log: Payload = {
        at: new Date(),
        method: req.method,
        origin: req.url,
        host: req.baseURL,
        req_header: req.headers.toString(),
        req_body: decoder.do(req.data),
        status_code: response.status,
        latency: 2,
        res_header: response.headers.toString(),
        res_body: response.data,
        error: err.toString(),
      };

      this.eventBus.post(new HTTPRequestDoneEvent(log));

      throw err;
    };
  }
}
