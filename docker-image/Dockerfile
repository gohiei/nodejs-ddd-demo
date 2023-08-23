FROM node:18.17.1-alpine

ENV TERM xterm
ENV TZ Asia/Taipei

RUN apk update && \
    apk --no-cache add nginx supervisor tzdata

RUN rm -f /etc/nginx/conf.d/*

RUN chown -R nobody:nobody /var/lib/nginx

COPY supervisord.conf /etc/supervisord.conf

COPY nginx.conf /etc/nginx/nginx.conf

COPY node.conf /etc/nginx/conf.d/node.conf

STOPSIGNAL SIGTERM

ENTRYPOINT []

WORKDIR ../

COPY . .

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
